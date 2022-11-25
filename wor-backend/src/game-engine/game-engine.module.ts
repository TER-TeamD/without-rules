import { Module } from '@nestjs/common';
import { GameEngineController } from './controllers/game-engine.controller';
import { GameEngineService } from './services/game-engine.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Game, GameSchema} from "./schema/game.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameEngineController],
  providers: [GameEngineService]
})
export class GameEngineModule {}
