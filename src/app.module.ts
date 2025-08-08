import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './auth/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './auth/user.controller';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false },  
      //type: 'postgres',
      //host: process.env.DB_HOST,
      //port: +process.env.DB_PORT!,
      //database: process.env.DB_NAME,
      //username: process.env.DB_USERNAME,
      //password: process.env.DB_PASSWORD,      
      //autoLoadEntities: true,
      //synchronize: true,
    }),
    CommentsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
