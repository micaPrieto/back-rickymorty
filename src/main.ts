import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilita CORS para permitir que Angular acceda
  app.enableCors({
    origin: 'http://localhost:4200', // URL del frontend
    //credentials: true, // si estás usando cookies o auth headers
  });
  app.useGlobalPipes(new ValidationPipe({
       whitelist: true,
      //  Remueve los datos que van de más en el body de la request
      // Y unicamente envía lo que se ha especificado en el DTO

       forbidNonWhitelisted: true,
      //  Si hay datos de más en el body de la request tira un error
      // Indicando que la propiedad no debería de existir
     
    }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
