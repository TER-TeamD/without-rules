import { Test, TestingModule } from '@nestjs/testing';
import { GameResultService } from './game-result.service';
import {RoundResultService} from "./round-result.service";
import {DuringRoundService} from "./during-round.service";
import {InitializeGameService} from "./initialize-game.service";
import {StartGameService} from "./start-game.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Game, GameSchema} from "../../schema/game.schema";

describe('GameResultService', () => {
  let gameResultService: GameResultService
  let roundResultService: RoundResultService;
  let duringRoundService: DuringRoundService;
  let initializeGameService: InitializeGameService;
  let startGameService: StartGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameResultService, RoundResultService, DuringRoundService, InitializeGameService, StartGameService],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017'),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
      ],
    }).compile();

    gameResultService = module.get<GameResultService>(GameResultService);
    roundResultService = module.get<RoundResultService>(RoundResultService);
    initializeGameService = module.get<InitializeGameService>(InitializeGameService);
    startGameService = module.get<StartGameService>(StartGameService)
    duringRoundService = module.get<DuringRoundService>(DuringRoundService);

  });

  it('should be defined', () => {
    expect(gameResultService).toBeDefined();
  });
});
