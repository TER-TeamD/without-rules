import { Test, TestingModule } from '@nestjs/testing';
import { RoundResultService } from './round-result.service';
import {DuringRoundService} from "./during-round.service";
import {InitializeGameService} from "./initialize-game.service";
import {StartGameService} from "./start-game.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Card, Game, GameSchema} from "../../schema/game.schema";

describe('RoundResultService', () => {
  let roundResultService: RoundResultService;
  let duringRoundService: DuringRoundService;
  let initializeGameService: InitializeGameService;
  let startGameService: StartGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundResultService, DuringRoundService, InitializeGameService, StartGameService],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017'),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
      ],
    }).compile();

    roundResultService = module.get<RoundResultService>(RoundResultService);
    initializeGameService = module.get<InitializeGameService>(InitializeGameService);
    startGameService = module.get<StartGameService>(StartGameService)
    duringRoundService = module.get<DuringRoundService>(DuringRoundService);

  });

  it('scenario', async () => {
    let currentGame: Game = await startGameService.generateNewGame();

    const playerOneId: string = currentGame.players[0].id
    const playerTwoId: string = currentGame.players[1].id
    const playerThreeId: string = currentGame.players[2].id
    await initializeGameService.playerJoinGame(playerOneId)
    await initializeGameService.playerJoinGame(playerTwoId)
    await initializeGameService.playerJoinGame(playerThreeId)

    currentGame = await initializeGameService.launchGame();

    currentGame = await duringRoundService.newPlayerPlayed(currentGame.players[0].id, currentGame.players[0].cards[0].value);
    currentGame = await duringRoundService.newPlayerPlayed(currentGame.players[1].id, currentGame.players[1].cards[0].value);
    currentGame = await duringRoundService.newPlayerPlayed(currentGame.players[2].id, currentGame.players[2].cards[0].value);

    currentGame = await roundResultService.flipCardOrder()

    for (let i = 1; i < currentGame.in_game_property.between_round.playerOrder.length; i++) {
      const lastValue: number = currentGame.in_game_property.between_round.playerOrder[i-1].player.in_player_game_property.played_card.value
      const currentValue: number = currentGame.in_game_property.between_round.playerOrder[i].player.in_player_game_property.played_card.value

      expect(currentValue).toBeGreaterThan(lastValue);
    }

    // currentGame = await duringRoundService.nextRound();
    // expect(currentGame.in_game_property.between_round).toBe(null);

  });
});
