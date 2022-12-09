import { Test, TestingModule } from '@nestjs/testing';
import { GameEngineController } from './game-engine.controller';
import {Server} from "socket.io";
import {NewGameDto} from "../dto/new-game.dto";
import {StatusDto} from "../dto/status.dto";

describe('GameEngineController', () => {
  let controller: GameEngineController;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameEngineController],
    }).compile();

    controller = module.get<GameEngineController>(GameEngineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Start new game', async () => {
    const result: NewGameDto = await controller.createGame();
    expect(result).toBeDefined();
    expect(result.id_game).toBeDefined();
    expect(result.potential_players_id.length).toBe(2);
  });


  it('Stop new game', async () => {
    const result: StatusDto = await controller.deleteGame();
    expect(result).toBeDefined();
    expect(result.status).toBe(200);
  });
});
