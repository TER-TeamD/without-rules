import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ChooseStackCardPlayerAction,
  Game,
  GameDocument,
  NextRoundPlayerAction,
} from '../schema/game.schema';
import { Model } from 'mongoose';
import { WebsocketGateway } from './websocket.gateway';
import { DuringRoundService } from './main-engine/during-round.service';
import { GameResultService } from './main-engine/game-result.service';
import { InitializeGameService } from './main-engine/initialize-game.service';
import { RoundResultService } from './main-engine/round-result.service';
import { StartGameService } from './main-engine/start-game.service';
import { PlayerNotFoundException } from './main-engine/exceptions/player-not-found.exception';
import { GameNotFoundException } from './main-engine/exceptions/game-not-found.exception';
import { UserNotFoundWhenJoinGameException } from './main-engine/exceptions/user-not-found-when-join-game.exception';
import { NotEnoughPlayersForStartingGameException } from './main-engine/exceptions/not-enough-players-for-starting-game.exception';
import { PlayerAlreadyPlayedCardException } from './main-engine/exceptions/player-already-played-card.exception';
import { PlayerDontHaveCardException } from './main-engine/exceptions/player-dont-have-card.exception';
import { StackNotFoundException } from './main-engine/exceptions/stack-not-found.exception';
import { EngineUtilsService } from './main-engine/engine-utils.service';
import { MAX_ROUND_NUMBER } from '../config';

@Injectable()
export class GameEngineService implements OnModuleInit {
  private readonly logger: Logger = new Logger();

  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @Inject(forwardRef(() => WebsocketGateway))
    private readonly webSocketGateway: WebsocketGateway,
    private readonly duringRoundService: DuringRoundService,
    private readonly gameResultService: GameResultService,
    private readonly initializeGameService: InitializeGameService,
    private readonly roundResultService: RoundResultService,
    private readonly startGameService: StartGameService,
  ) {}

  onModuleInit(): any {}

  public async tableCreateNewGame(): Promise<void> {
    const game: Game = await this.startGameService.generateNewGame();
    await this.webSocketGateway.sendNewGameValueToTable(
      game,
      'CREATE_NEW_GAME',
    );
  }

  public async playerJoinGame(player_id: string): Promise<void> {
    try {
      const game: Game = await this.initializeGameService.playerJoinGame(
        player_id,
      );

      const indexPlayer: number = game.players.findIndex(
        (p) => p.id === player_id,
      );
      await this.webSocketGateway.sendPlayerInfosToPlayer(
        game.players[indexPlayer],
        'PLAYER_LOGGED_IN_GAME',
      );

      await this.webSocketGateway.sendNewGameValueToTable(
        game,
        'TABLE_PLAYER_JOIN',
      );
    } catch (error) {
      if (error instanceof GameNotFoundException) {
        this.logger.error('Game not found');
      }

      if (error instanceof UserNotFoundWhenJoinGameException) {
        this.logger.error('User not found when he tried to join game');
      }

      this.logger.error('Unhandled error: ', error);
    }
  }

  public async tableStartGame(): Promise<void> {
    try {
      const game: Game = await this.initializeGameService.launchGame();

      await this.webSocketGateway.sendNewGameValueToTable(game, 'START_GAME');
      for (const p of game.players) {
        await this.webSocketGateway.sendPlayerInfosToPlayer(p, 'START_GAME');
      }
    } catch (error) {
      if (error instanceof GameNotFoundException) {
        this.logger.error('Game not found');
      }

      if (error instanceof NotEnoughPlayersForStartingGameException) {
        this.logger.error('Not enough players for starting the game');
      }
    }
  }

  public async playerPlayedCard(player_id: string, card_value: number,): Promise<void> {

    try {
      const game: Game = await this.duringRoundService.newPlayerPlayed(player_id, card_value);
      await this.webSocketGateway.sendNewGameValueToTable(game, 'NEW_PLAYER_PLAYED_CARD',);

      const indexPlayer: number = game.players.findIndex(
        (p) => p.id === player_id,
      );

      await this.webSocketGateway.sendPlayerInfosToPlayer(game.players[indexPlayer], 'CARD_PLAYED');

    } catch (error) {
      if (error instanceof GameNotFoundException) {
        this.logger.error('Game not found');
      }

      if (error instanceof PlayerNotFoundException) {
        this.logger.error('Player is not found');
      }
      if (error instanceof PlayerAlreadyPlayedCardException) {
        this.logger.error('Player already played a card');
      }
      if (error instanceof PlayerDontHaveCardException) {
        this.logger.error("Played don't have the card he want to play");
      }
    }
  }

  public async tableAllPlayerPlayed(): Promise<void> {
    try {
      if (await this.duringRoundService.isRoundFinished()) {
        const gameWithFlipCard: Game = await this.roundResultService.flipCardOrder();

        await this.webSocketGateway.sendNewGameValueToTable(gameWithFlipCard, 'FLIP_CARD_ORDER',);

        const game: Game = await this.roundResultService.generateNextAction();
        await this.webSocketGateway.sendNewGameValueToTable(game, 'NEW_RESULT_ACTION',);
      }
    } catch (error) {
      if (error instanceof GameNotFoundException) {
        console.error('Game not found');
      } else if (error instanceof PlayerNotFoundException) {
        console.error('Player is not found');
      } else if (error instanceof PlayerAlreadyPlayedCardException) {
        console.error('Player already played a card');
      }else if (error instanceof PlayerDontHaveCardException) {
        console.error("Played don't have the card he want to play");
      } else if (error instanceof StackNotFoundException) {
        console.error('Stack not found');
      } else {
        console.error(error)
      }
    }
  }

  public async tableNextRoundResultAction(choosen_stack: number | null,): Promise<void> {

    try {
      const currentGame: Game = await EngineUtilsService.getCurrentGame(this.gameModel,);

      // Si la précédente action est une action du type ChooseStackCardPlayerAction, on donne le choosen stack
      if (choosen_stack != null
          && currentGame.in_game_property.between_round.current_player_action != null
          && currentGame.in_game_property.between_round.current_player_action.action.type === "CHOOSE_STACK_CARD"
      ) {
        const newRoundGame: Game = await this.roundResultService.updateActionWhenChooseStackCard(choosen_stack);
      }

      const game: Game = await this.roundResultService.generateNextAction();
      await this.webSocketGateway.sendNewGameValueToTable(game, 'NEW_RESULT_ACTION',);

      if (currentGame.in_game_property.between_round.current_player_action != null
          && currentGame.in_game_property.between_round.current_player_action.action.type === "NEXT_ROUND"
      ) {
        if (currentGame.in_game_property.current_round === MAX_ROUND_NUMBER) {
          // Fin du jeu, envoie des resultats
          console.log("END game result")
          const endGame: Game = await this.gameResultService.getResults();
          await this.webSocketGateway.sendNewGameValueToTable(endGame, 'END_GAME_RESULTS',);
          for (const p of endGame.players) {
            await this.webSocketGateway.sendPlayerInfosToPlayer(p, 'END_GAME_RESULTS',);
          }
        } else {

          console.log("New round game")
          const newRoundGame: Game = await this.duringRoundService.nextRound();
          await this.webSocketGateway.sendNewGameValueToTable(newRoundGame, 'NEW_ROUND',);
          for (const p of newRoundGame.players) {
            await this.webSocketGateway.sendPlayerInfosToPlayer(p, 'NEW_ROUND');
          }

        }
      }
    } catch (error) {
      let raised = false;
      if (error instanceof GameNotFoundException) {
        this.logger.error('Game not found');
        raised = true;
      }
      if (error instanceof PlayerNotFoundException) {
        this.logger.error('Player is not found');
        raised = true;
      }
      if (error instanceof PlayerAlreadyPlayedCardException) {
        this.logger.error('Player already played a card');
        raised = true;
      }
      if (error instanceof PlayerDontHaveCardException) {
        this.logger.error("Played don't have the card he want to play");
        raised = true;
      }
      if (error instanceof StackNotFoundException) {
        this.logger.error('Stack not found');
        raised = true;
      }

      if(!raised) {
        console.log("Unexpected error: ", error);
      }
    }
  }
}
