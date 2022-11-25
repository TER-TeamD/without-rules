import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameEngineModule } from './game-engine/game-engine.module';
import {EventsModule} from "./events/events.module";

@Module({
  imports: [GameEngineModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
