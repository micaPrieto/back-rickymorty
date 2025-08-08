import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService, // Este servicio lo proporciona nest/ jwt
  ){}


  async create(createUserDto: CreateUserDto) {

    try{
       // Desestructuramos la contraseña del DTO recibido,
    // y almacenamos el resto de los datos (nombre, email, etc.) en userData
      const { password, ...userData } = createUserDto

      
       // Creamos una nueva instancia del usuario a guardar,
    // combinando los datos del formulario (userData) con la contraseña hasheada.
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 ) // Se genera un hash aleatorio cada vez (salt rounds = 10)
      }); 
      
      // Guardamos el nuevo usuario en la base de datos
      await this.userRepository.save(user)
      //delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }) // Genera y devuelve el JWT
      };

    }catch(error){
      this.handleDBErrors(error);
    }

  }

  //never: jamas debe regresar un valor
  private handleDBErrors2( error: any ): never {

    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');
  }


  private handleDBErrors(error: any): never {
    
    // Error de clave única ( email repetido)
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    // Error de validación de datos
    if (error.code === '23502') {
      throw new BadRequestException(`Missing field: ${error.column}`);
    }

    if (error.code === '22P02') {
      throw new BadRequestException(`Invalid data type for a field`);
    }

    console.error('DB Error:', error);

    throw new InternalServerErrorException(error.message || 'Unexpected error');
  }



  async login( loginUserDto: LoginUserDto ) {

    // Desestructuramos el email y la contraseña del objeto recibido
    const { password, email } = loginUserDto;

    // Buscamos al usuario en la base de datos usando el email proporcionado
    const user = await this.userRepository.findOne({
      where: { email }, // Solo seleccionamos el email, la contraseña y el id (la contraseña suele estar oculta por defecto)
      select: { email: true, password: true, id: true}
    });

    if ( !user ) // Si no se encontró el mail
      throw new UnauthorizedException('Credentials are not valid (email)');
      
    //Si no se encontró la contraseña
    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');
    
    //Busco nuevamente el usuario sin limitar los campos (no solo email, contra e id)
    const fullUser = await this.userRepository.findOne({
      where: { id: user.id }
    });

    // Si las credenciales son válidas, devolvemos el usuario junto con un token JWT
    return {
      //...user,
      user: fullUser,
      token: this.getJwtToken({id: fullUser!.id}) // Generamos el token con el id del usuario
    };
    
  }


  private getJwtToken( payload: JwtPayload ) {  
    const token = this.jwtService.sign( payload );
    return token;
  }
  
  async checkAuthStatus( user: User ){

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }



  async addFavorite(user: User, episodeId: string) {
    const userInDb = await this.userRepository.findOneBy({ id: user.id });

    if (!userInDb) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!userInDb.episodesFavorites.includes(episodeId)) {
        userInDb.episodesFavorites.push(episodeId);
        await this.userRepository.save(userInDb);
    }

    return { favorites: userInDb.episodesFavorites };
  }

  async removeFavorite(user: User, episodeId: string) {
    const userInDb = await this.userRepository.findOneBy({ id: user.id });
    
    if (!userInDb) {
      throw new NotFoundException('Usuario no encontrado');
    }

    userInDb.episodesFavorites = userInDb.episodesFavorites.filter(id => id !== episodeId);

    await this.userRepository.save(userInDb);

    return { episodesFavorites: userInDb.episodesFavorites };
  }

  async getFavorites(user: User) {
    const userInDb = await this.userRepository.findOneBy({ id: user.id });

    if (!userInDb) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return { episodesFavorites: userInDb.episodesFavorites };
  }


  async updateProfileImage(userId: string, fileName: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.profileImage = `uploads/profile-images/${fileName}`;
    await this.userRepository.save(user);

    return {
      message: 'Imagen de perfil actualizada',
      profileImage: user.profileImage,
    };
  }


}
