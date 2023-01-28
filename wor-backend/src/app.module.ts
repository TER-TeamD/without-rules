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
    MongooseModule.forRoot('mongodb://database:27017'),
    GameEngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
