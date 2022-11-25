import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {SwaggerUIConfig} from "./shared/config/inferfaces/swaggerui-config.interface";
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Retrieve config service
  const configService = app.get(ConfigService);

  // Add validation pipi for all endpoints
  app.useGlobalPipes(new ValidationPipe());

  // Swagger UI Definition
  const swaggeruiConfig = configService.get<SwaggerUIConfig>('swaggerui');
  const config = new DocumentBuilder()
      .setTitle(swaggeruiConfig.title)
      .setDescription(swaggeruiConfig.description)
      .setVersion(configService.get('npm_package_version'))
      .addServer('/', 'Without gateway')
      .addServer('/kitchen', 'Through gateway')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggeruiConfig.path, app, document);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(3000).then(c => {
    console.log(3000)
  });
}
bootstrap();
