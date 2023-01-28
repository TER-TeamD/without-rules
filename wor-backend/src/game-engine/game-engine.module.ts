import { Module } from '@nestjs/common';
import { GameEngineController } from './controllers/game-engine.controller';
import { GameEngineService } from './services/game-engine.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Game, GameSchema} from "./schema/game.schema";
import {WebsocketGateway} from "./services/websocket.gateway";
import { StartGameService } from './services/main-engine/start-game.service';
import { InitializeGameService } from './services/main-engine/initialize-game.service';
import { EngineUtilsService } from './services/main-engine/engine-utils.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameEngineController],
  providers: [GameEngineService, WebsocketGateway, StartGameService, InitializeGameService, EngineUtilsService],
  exports: []
})
export class GameEngineModule {}
