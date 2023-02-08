import { Test, TestingModule } from '@nestjs/testing';
import { InitializeGameService } from './initialize-game.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Card, Game, GameSchema} from "../../schema/game.schema";
import {StartGameService} from "./start-game.service";
import {GameNotFoundException} from "./exceptions/game-not-found.exception";
import {UserNotFoundWhenJoinGameException} from "./exceptions/user-not-found-when-join-game.exception";
import exp from "constants";

describe('InitializeGameService', () => {
  let initializeGameService: InitializeGameService;
  let startGameService: StartGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitializeGameService, StartGameService],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017'),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
      ],
    }).compile();

    initializeGameService = module.get<InitializeGameService>(InitializeGameService);
    startGameService = module.get<StartGameService>(StartGameService)
  });

  it('should be defined', () => {
    expect(startGameService).toBeDefined();
    expect(initializeGameService).toBeDefined();
  });


  it('should raise exception because any game was created', async () => {

    await startGameService.__deleteOtherGames();

    try {
      const game: Game = await initializeGameService.playerJoinGame("abc", "")
      expect(false).toBe(true)
    } catch (error) {

      if (error instanceof GameNotFoundException) {
        expect(true).toBe(true)
      }

      if (error instanceof UserNotFoundWhenJoinGameException) {
        expect(false).toBe(true)
      }
    }
  });

  it('should raise exception because player was not found', async () => {

    const currentGame: Game = await startGameService.generateNewGame();

    try {
      const game: Game = await initializeGameService.playerJoinGame("abc", "")
      expect(false).toBe(true)
    } catch (error) {

      if (error instanceof GameNotFoundException) {
        expect(false).toBe(true)
      }

      if (error instanceof UserNotFoundWhenJoinGameException) {
        expect(true).toBe(true)
      }
    }
  });

  it('should create a new player', async () => {

    const currentGame: Game = await startGameService.generateNewGame();
    const goodIdPlayer = currentGame.players[0].id
    expect(currentGame.players[0].is_logged).toBe(false);

    try {
      const game: Game = await initializeGameService.playerJoinGame(goodIdPlayer, "")
      expect(game.players[0].id).toBe(goodIdPlayer);
      expect(game.players[0].is_logged).toBe(true);

    } catch (error) {
      if (error instanceof GameNotFoundException) {
        expect(false).toBe(true)
      }
      if (error instanceof UserNotFoundWhenJoinGameException) {
        expect(false).toBe(true)
      }
    }
  });



  it('test generateCardDeck()', async () => {
    const cardsGenerated: Card[] = initializeGameService.__generateCardDeck();

    const sevenCattle = cardsGenerated.filter(c => c.cattleHead === 7);
    expect(sevenCattle.length).toBe(1);

    const fiveCattle = cardsGenerated.filter(c => c.cattleHead === 5);
    expect(fiveCattle.length).toBe(8);

    const threeCattle = cardsGenerated.filter(c => c.cattleHead === 3);
    expect(threeCattle.length).toBe(10);

    const twoCattle = cardsGenerated.filter(c => c.cattleHead === 2);
    expect(twoCattle.length).toBe(9);

    const oneCattle = cardsGenerated.filter(c => c.cattleHead === 1);
    expect(oneCattle.length).toBe(76);
  });

  it('test __initiateGameCards()', async () => {
    let currentGame: Game = await startGameService.generateNewGame();

    const playerOne = currentGame.players[0].id
    const playerTwo = currentGame.players[1].id
    currentGame = await initializeGameService.playerJoinGame(playerOne, "")
    currentGame = await initializeGameService.playerJoinGame(playerTwo, "")
    const newGame: Game = initializeGameService.__initiateGameCards(currentGame);

    expect(newGame.players[0].cards.length).toBe(10);
    expect(newGame.players[1].cards.length).toBe(10);
    expect(newGame.in_game_property.stacks.length).toBe(4);
    expect(newGame.in_game_property.deck.length).toBe(80)
  });

  it('test launchGame()', async () => {

    let currentGame: Game = await startGameService.generateNewGame();

    const playerOne: string = currentGame.players[0].id
    const playerTwo: string = currentGame.players[1].id
    const playerThree: string = currentGame.players[2].id
    await initializeGameService.playerJoinGame(playerOne, "")
    await initializeGameService.playerJoinGame(playerTwo, "")
    await initializeGameService.playerJoinGame(playerThree, "")


    const gameInDb: Game = await initializeGameService.launchGame();
    const realGameInDb: Game = await initializeGameService.gameModel.findOne({_id: currentGame._id})

    expect(realGameInDb.players.length).toBe(3);
    expect(realGameInDb.players[0].is_logged).toBe(true);
    expect(realGameInDb.players[1].is_logged).toBe(true);
    expect(realGameInDb.players[2].is_logged).toBe(true);
    expect(realGameInDb.players[0].cards.length).toBe(10);
    expect(realGameInDb.players[1].cards.length).toBe(10);
    expect(realGameInDb.players[2].cards.length).toBe(10);
    expect(realGameInDb.in_game_property.stacks.length).toBe(4);
    expect(realGameInDb.in_game_property.deck.length).toBe(104 - 30 - 4);

  })


});
