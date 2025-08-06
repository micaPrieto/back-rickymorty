import { Headers, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';


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
