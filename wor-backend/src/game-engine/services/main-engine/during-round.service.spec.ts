import { Test, TestingModule } from '@nestjs/testing';
import { DuringRoundService } from './during-round.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Card, Game, GameSchema, Player} from "../../schema/game.schema";
import {InitializeGameService} from "./initialize-game.service";
import {StartGameService} from "./start-game.service";

describe('DuringRoundService', () => {
  let duringRoundService: DuringRoundService;
  let initializeGameService: InitializeGameService;
  let startGameService: StartGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DuringRoundService, InitializeGameService, StartGameService],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017'),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
      ],
    }).compile();

    initializeGameService = module.get<InitializeGameService>(InitializeGameService);
    startGameService = module.get<StartGameService>(StartGameService)
    duringRoundService = module.get<DuringRoundService>(DuringRoundService);
  });

  it('test nextRound()', async () => {

    let currentGame: Game = await startGameService.generateNewGame();

    const playerOneId: string = currentGame.players[0].id
    const playerTwoId: string = currentGame.players[1].id
    const playerThreeId: string = currentGame.players[2].id
    await initializeGameService.playerJoinGame(playerOneId, "William")
    await initializeGameService.playerJoinGame(playerTwoId, "Mathilde")
    await initializeGameService.playerJoinGame(playerThreeId, "Roger")

    currentGame = await initializeGameService.launchGame();

    currentGame = await duringRoundService.newPlayerPlayed(currentGame.players[0].id, currentGame.players[0].cards[0].value);
    expect(await duringRoundService.isRoundFinished()).toBe(false)
    currentGame = await duringRoundService.newPlayerPlayed(currentGame.players[1].id, currentGame.players[1].cards[0].value);
    expect(await duringRoundService.isRoundFinished()).toBe(false)
    const player2PlayedCard: Card = currentGame.players[2].cards[0];
    currentGame = await duringRoundService.newPlayerPlayed(currentGame.players[2].id, player2PlayedCard.value);
    expect(await duringRoundService.isRoundFinished()).toBe(true)

    currentGame = await duringRoundService.nextRound();

    expect(currentGame.in_game_property.current_round).toBe(2);
    expect(currentGame.players[0].cards.length).toBe(9);
    expect(currentGame.players[1].cards.length).toBe(9);
    expect(currentGame.players[2].cards.length).toBe(9);
    expect(currentGame.players[2].played_cards.length).toBe(1);
    expect(currentGame.players[2].played_cards[0].value).toBe(player2PlayedCard.value);

    expect(currentGame.players[0].in_player_game_property.played_card).toBe(null);
    expect(currentGame.players[0].in_player_game_property.had_played_turn).toBe(false);
  });

  it('test isRoundFinished()', async () => {

    let currentGame: Game = await startGameService.generateNewGame();

    const playerOne: string = currentGame.players[0].id
    const playerTwo: string = currentGame.players[1].id
    const playerThree: string = currentGame.players[2].id
    await initializeGameService.playerJoinGame(playerOne, "William")
    await initializeGameService.playerJoinGame(playerTwo, "Mathilde")
    await initializeGameService.playerJoinGame(playerThree, "Roger")

    currentGame = await initializeGameService.launchGame();

    expect(await duringRoundService.isRoundFinished()).toBe(false)
  });
});
