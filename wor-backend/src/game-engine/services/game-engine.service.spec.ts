import { Test, TestingModule } from '@nestjs/testing';
import { GameEngineService } from './game-engine.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Game, GameSchema, Player} from "../schema/game.schema";
import {GameResultService} from "./main-engine/game-result.service";
import {RoundResultService} from "./main-engine/round-result.service";
import {DuringRoundService} from "./main-engine/during-round.service";
import {InitializeGameService} from "./main-engine/initialize-game.service";
import {StartGameService} from "./main-engine/start-game.service";
import {EngineUtilsService} from "./main-engine/engine-utils.service";
import {WebsocketGateway} from "./websocket.gateway";

describe('GameEngineService', () => {
  let gameEngineService: GameEngineService;
  let gameResultService: GameResultService
  let roundResultService: RoundResultService;
  let duringRoundService: DuringRoundService;
  let initializeGameService: InitializeGameService;
  let startGameService: StartGameService;
  let websocketGateway: WebsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameResultService, RoundResultService, DuringRoundService, InitializeGameService, StartGameService, GameEngineService, WebsocketGateway],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017'),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
      ],
    }).compile();

    gameEngineService = module.get<GameEngineService>(GameEngineService);

    gameResultService = module.get<GameResultService>(GameResultService);
    roundResultService = module.get<RoundResultService>(RoundResultService);
    initializeGameService = module.get<InitializeGameService>(InitializeGameService);
    startGameService = module.get<StartGameService>(StartGameService)
    duringRoundService = module.get<DuringRoundService>(DuringRoundService);
    websocketGateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  it('Start a game', async () => {

    await gameEngineService.tableCreateNewGame();

    let game: Game = await EngineUtilsService.getCurrentGame(initializeGameService.gameModel);
    let player1: Player = game.players[0];
    let player2: Player = game.players[1];

    expect(player1.is_logged).toBe(false);
    expect(player2.is_logged).toBe(false);

    await gameEngineService.playerJoinGame(player1.id);
    await gameEngineService.playerJoinGame(player2.id);

    game = await EngineUtilsService.getCurrentGame(initializeGameService.gameModel);
    player1 = game.players[0];
    player2 = game.players[1];

    expect(player1.is_logged).toBe(true);
    expect(player2.is_logged).toBe(true);

    await gameEngineService.tableStartGame();
    game = await EngineUtilsService.getCurrentGame(initializeGameService.gameModel);
    player1 = game.players[0];
    player2 = game.players[1];

    expect(game.players.length).toBe(2);
    expect(player1.cards.length).toBe(10);
    expect(player2.cards.length).toBe(10);

    player1.cards[0].value = 10;
    player1.cards[1].value = 20;
    player2.cards[0].value = 12;
    player2.cards[1].value = 22;
    game.in_game_property.stacks[0].stackHead.value = 8;
    game.in_game_property.stacks[1].stackHead.value = 50;
    game.in_game_property.stacks[2].stackHead.value = 55;
    game.in_game_property.stacks[3].stackHead.value = 60;

    game = await EngineUtilsService.setCurrentGame(initializeGameService.gameModel, game);
    player1 = game.players[0];
    player2 = game.players[1];
    expect(game.in_game_property.stacks[0].stackHead.value).toBe(8)
    expect(player1.cards[0].value).toBe(10);

    expect(game.in_game_property.current_round).toBe(1);
    expect(game.in_game_property.between_round).toBe(null);

    await gameEngineService.playerPlayedCard(player1.id, player1.cards[0].value);
    await gameEngineService.playerPlayedCard(player2.id, player2.cards[0].value);

    game = await EngineUtilsService.getCurrentGame(initializeGameService.gameModel);
    player1 = game.players[0];
    player2 = game.players[1];

    expect(player1.in_player_game_property.had_played_turn).toBe(true);
    expect(player1.in_player_game_property.played_card.value).toBe(10);
    expect(player2.in_player_game_property.had_played_turn).toBe(true);
    expect(player2.in_player_game_property.played_card.value).toBe(12);

    await gameEngineService.tableAllPlayerPlayed();
    game = await EngineUtilsService.getCurrentGame(initializeGameService.gameModel);
    player1 = game.players[0];
    player2 = game.players[1];

    expect(game.in_game_property.between_round.playerOrder[0].player.id).toBe(player1.id)
    expect(game.in_game_property.between_round.playerOrder[1].player.id).toBe(player2.id)

    // expect(game.in_game_property.between_round.index_current_player_action_in_player_order).toBe(0);
    expect(game.in_game_property.between_round.current_player_action.player.id).toBe(player1.id);
    expect(game.in_game_property.between_round.current_player_action.action.type).toBe("SEND_CARD_TO_STACK_CARD");

    await gameEngineService.tableNextRoundResultAction(null);
    game = await EngineUtilsService.getCurrentGame(initializeGameService.gameModel);
    player1 = game.players[0];
    player2 = game.players[1];
    expect(game.in_game_property.between_round.current_player_action.player.id).toBe(player2.id);
    expect(game.in_game_property.between_round.current_player_action.action.type).toBe("SEND_CARD_TO_STACK_CARD");


  });
});
