import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

//TOKEN que los usarios almacenan fisicamente en el dispositivo
// y cada vez que uiqeran acceder a algun endpoint qu erequiera autenticacino, van a usar este token

@Injectable()  
export class JwtStrategy extends PassportStrategy( Strategy ) {


    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET') as string,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    //Se llama si el token si no ha expirado, y si la firma hace match con el token 
    //Esto se ejecuta cuando el token paso las 2 validaciones
    // Y acá se evalua el payload
    async validate( payload: JwtPayload ): Promise<User> {
        
        const { id } = payload;
        
        const user = await this.userRepository.findOneBy({ id });

        if ( !user ) // Si el usuario no existe
            throw new UnauthorizedException('Token not valid')
            
        if ( !user.isActive ) //Si existe, pero no esta activo
            throw new UnauthorizedException('User is inactive, talk with an admin');

         console.log({user});

        return user;
    }

    
}

