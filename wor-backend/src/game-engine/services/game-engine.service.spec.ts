import { Test, TestingModule } from '@nestjs/testing';
import { GameEngineService } from './game-engine.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Game, GameSchema} from "../schema/game.schema";

describe('GameEngineService', () => {
  let service: GameEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameEngineService],
      imports: [],
    }).compile();

    service = module.get<GameEngineService>(GameEngineService);
  });

  it('Start a game', () => {
    expect(service).toBeDefined();

    service.createNewGame();



  });
});
