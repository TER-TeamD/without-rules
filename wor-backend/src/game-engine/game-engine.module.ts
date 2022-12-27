import { Module } from '@nestjs/common';
import { GameEngineController } from './controllers/game-engine.controller';
import { GameEngineService } from './services/game-engine.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Game, GameSchema} from "./schema/game.schema";
import {WebsocketGateway} from "./services/websocket.gateway";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameEngineController],
  providers: [GameEngineService, WebsocketGateway],
  exports: []
})
export class GameEngineModule {}
