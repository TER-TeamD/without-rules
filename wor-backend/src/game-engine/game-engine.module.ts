import { Module } from '@nestjs/common';
import { GameEngineController } from './controllers/game-engine.controller';
import { GameEngineService } from './services/game-engine.service';

@Module({
  controllers: [GameEngineController],
  providers: [GameEngineService]
})
export class GameEngineModule {}
