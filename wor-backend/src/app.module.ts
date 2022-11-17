import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameEngineModule } from './game-engine/game-engine.module';

@Module({
  imports: [GameEngineModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
