import { Headers, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.userService.login( loginUserDto );
  }

//* Con protección de rutas  más resumido
  @Get('private')  // Por si solo determinados roles pueden acceder a esta ruta
  @Auth( ValidRoles.user ) 
  privateRoute(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.userService.checkAuthStatus( user );
  }

  @Patch('edit-profile')
  @Auth()
  updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User
  ) {
    return this.userService.updateUser(user, updateUserDto);
  }


  @Patch('favorites/:episodeId')
  @Auth()
  addFavorite(@GetUser() user: User, @Param('episodeId') episodeId: string) {
    return this.userService.addFavorite(user, episodeId);
  }

  @Delete('favorites/:episodeId')
  @Auth()
  removeFavorite(@GetUser() user: User, @Param('episodeId') episodeId: string) {
    return this.userService.removeFavorite(user, episodeId);
  }

  @Get('favorites')
  @Auth()
  getFavorites(@GetUser() user: User) {
    return this.userService.getFavorites(user);
  }

  // ? IMAGENES

  @Patch('upload-profile-image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile-images', // Podés cambiar esta ruta
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  @Auth() 
   uploadProfileImage(
    @UploadedFile() file: any,
    @GetUser() user: User
  ) {
    return this.userService.updateProfileImage(user.id, file.filename);
  }



  /* Con protección de rutas menos resumido
  @Get('private3')
  @RoleProtected( ValidRoles.user)
  //@SetMetadata('roles', ['admin','super-user'])
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      user
    }
  }
*/
/*
   @Get('private2')
   @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User, //Si no le mando ningun argumento, me trae el usuario entero
    @GetUser('email') userEmail: string, 
    
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders
  ) {
    console.log( request);
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }
  
*/

}
