import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



//Devuelve todo el objeto user si no paso data.
// Devuelve una propiedad específica (user[data]) si paso un string como argumento
export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {
    //ExecutionContext: contexto en el que se esta ejecutando la funcion en este momento
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if ( !user )
            throw new InternalServerErrorException('User not found (request)');

        return ( !data ) ? user : user[data];
        
    }
);

