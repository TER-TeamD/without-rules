import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameEngineModule } from './game-engine/game-engine.module';
import { MongooseConfigService } from './shared/services/mongoose-config.service';
import mongodbConfig from './shared/config/mongodb.config';
import appConfig from './shared/config/app.config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import swaggeruiConfig from "./shared/config/swaggerui.config";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongodbConfig, swaggeruiConfig],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    GameEngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
