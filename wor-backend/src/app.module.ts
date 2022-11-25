import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameEngineModule } from './game-engine/game-engine.module';
import { EventsModule } from './events/events.module';
import { MongooseConfigService } from './shared/services/mongoose-config.service';
import mongodbConfig from './shared/config/mongodb.config';
import appConfig from './shared/config/app.config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongodbConfig],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    GameEngineModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
