import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {SwaggerUIConfig} from "./shared/config/inferfaces/swaggerui-config.interface";
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();


  await app.listen(3000).then(c => {
    console.log(3000)
  });
}
bootstrap();
