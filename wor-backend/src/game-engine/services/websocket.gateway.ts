import {
  Body,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Param,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameEngineService } from './game-engine.service';
import { NewGameDto } from '../dto/new-game.dto';
import { ConnexionStatusEnum } from '../schema/manager.enums';
import {
  Action,
  Card,
  Game,
  Player,
  Result,
  StackCard,
} from '../schema/game.schema';
import { PlayedCardDto } from '../dto/played-card.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private entitiesConnected: {} = {}; // socket_id: string, type: string
  private readonly logger: Logger = new Logger(WebsocketGateway.name);

  constructor(
    @Inject(forwardRef(() => GameEngineService))
    private readonly gameEngineService: GameEngineService,
  ) {}

  afterInit(server: Server): any {
    this.logger.log('Init');
  }

  handleConnection(client: Socket): any {
    this.logger.log(
      `Client connected: ${client.handshake.auth.id}, type : ${client.handshake.auth.type}`,
    );
    this.entitiesConnected[client.handshake.auth.id] = {
      socket_id: client.id,
      type: client.handshake.auth.type,
    };

    this.server
      .to(client.id)
      .emit('connection_status_server', { status: 'Connection established' });
  }

  handleDisconnect(client: Socket): any {
    delete this.entitiesConnected[client.handshake.auth.id];
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Message envoyé par la table quand on veut démarrer un nouveau jeu
   */
  @SubscribeMessage('TABLE_NEW_GAME')
  public async tableCreateNewGame(client: Socket, payload: {}): Promise<void> {
    this.logger.log(
      `Creation new game by a table -> ID : ${JSON.stringify(
        this.entitiesConnected[client.handshake.auth.id],
      )} : ${JSON.stringify(payload)}`,
    );

    await this.gameEngineService.tableCreateNewGame();
  }

  /**
   * Message envoyé par un téléphone quand un utilisateur rejoins la partie de jeu via son téléphone
   */
  @SubscribeMessage('PLAYER_JOIN_GAME')
  public async playerJoinGame(client: Socket, payload: any): Promise<void> {
    const message: { player_id: string } = payload;
    this.logger.log(
      `Player join game -> ID : ${JSON.stringify(
        this.entitiesConnected[client.handshake.auth.id],
      )} : ${JSON.stringify(payload)} `,
    );

    await this.gameEngineService.playerJoinGame(message.player_id);
  }

  /**
   * Message envoyé par la table quand un utilisateur à appuyer sur le bouton "Démarrer le jeu"
   */
  @SubscribeMessage('TABLE_START_GAME')
  public async tableStartGame(client: Socket, payload: any): Promise<void> {
    this.logger.log(
      `Start new game -> ID : ${JSON.stringify(
        this.entitiesConnected[client.handshake.auth.id],
      )} : ${JSON.stringify(payload)}`,
    );

    await this.gameEngineService.tableStartGame();
  }

  /**
   * Message envoyé par un téléphone quand un joueur a choisi une carte de jeu pour le round actuel
   */
  @SubscribeMessage('PLAYER_PLAYED_CARD')
  public async playerPlayedCard(client: Socket, payload: any): Promise<void> {
    const message: { player_id: string; card_value: number } = payload;
    this.logger.log(
      `Player played card -> ID : ${JSON.stringify(
        this.entitiesConnected[client.handshake.auth.id],
      )} : ${JSON.stringify(payload)} `,
    );

    await this.gameEngineService.playerPlayedCard(
      message.player_id,
      message.card_value,
    );
  }

  /**
   * Message envoyé par la table un joueur appuie sur un bouton afin d'aller aux resultats du round suite au fait que
   * tous les utilisateurs ont fini de jouer leur carte
   */
  @SubscribeMessage('TABLE_ALL_PLAYER_PLAYED')
  public async tableAllPlayerPlayed(
    client: Socket,
    payload: any,
  ): Promise<void> {
    this.logger.log(
      `Table all player played -> ID : ${JSON.stringify(
        this.entitiesConnected[client.handshake.auth.id],
      )} : ${JSON.stringify(payload)}`,
    );

    await this.gameEngineService.tableAllPlayerPlayed();
  }

  @SubscribeMessage('TABLE_NEXT_ROUND_RESULT_ACTION')
  public async tableNextRoundResultAction(
    client: Socket,
    payload: any,
  ): Promise<void> {
    const message: { choosen_stack: number | null } = payload;
    this.logger.log(
      `Table all player played -> ID : ${JSON.stringify(
        this.entitiesConnected[client.handshake.auth.id],
      )} : ${JSON.stringify(payload)}`,
    );

    await this.gameEngineService.tableNextRoundResultAction(
      message.choosen_stack,
    );
  }

  public async sendNewGameValueToTable(
    game: Game,
    topic: string,
  ): Promise<void> {
    await this.sendMessageToEntity('0', topic, {
      game,
    });
  }

  public async sendPlayerInfosToPlayer(
    player: Player,
    topic: string,
  ): Promise<void> {
    await this.sendMessageToEntity(player.id, topic, {
      player,
    });
  }

  private async sendMessageToEntity(
    id: string,
    topic: string,
    message: any,
  ): Promise<void> {
    const idUser = this.entitiesConnected[id].socket_id;

    if (idUser != null) {
      this.server.to(idUser).emit(topic, message);
    } else {
      this.logger.error(`The entity ${id} is not connected`);
    }
  }

  /*

    @SubscribeMessage('table_create_game')
    public async tableCreateGame(client: Socket, payload: any): Promise<void> {
        this.logger.log(
            `Creation new game by a table -> ID : ${JSON.stringify(
                this.entitiesConnected[client.handshake.auth.id],
            )} : ${JSON.stringify(payload)}`,
        );
        await this.gameEngineService.createNewGame();
    }

    @SubscribeMessage('player_join_game')
    public async playerJoinGame(client: Socket, payload: any): Promise<void> {
        const message: { player_id: string } = payload;
        this.logger.log(
            `Player join game -> ID : ${JSON.stringify(
                this.entitiesConnected[client.handshake.auth.id],
            )} : ${JSON.stringify(payload)} `,
        );
        await this.gameEngineService.playerJoinGame(message.player_id);
    }

    @SubscribeMessage('table_start_game')
    public async tableStartGame(client: Socket, payload: any): Promise<void> {
        this.logger.log(
            `Table start game -> ID : ${JSON.stringify(
                this.entitiesConnected[client.handshake.auth.id],
            )} : ${JSON.stringify(payload)} `,
        );
        await this.gameEngineService.startGame();
    }

    @SubscribeMessage('player_play_card')
    public async playerPlayCard(client: Socket, payload: any): Promise<void> {
        const message: { player_id: string; body: PlayedCardDto } = payload;
        this.logger.log(
            `Player play card -> ID : ${JSON.stringify(
                this.entitiesConnected[client.handshake.auth.id],
            )} : ${JSON.stringify(payload)} `,
        );
        await this.gameEngineService.playerPlayedACard(
            message.body,
            message.player_id,
        );
    }

    public async sendInitializationInformationsToTable(newGameDto: NewGameDto): Promise<void> {
        await this.sendMessageToEntity('0', 'player_initialization', newGameDto);
    }

    public async sendConfirmationMessageToPlayerWhenPlayerTriedToConnectToGame( status: ConnexionStatusEnum,  playerId: string): Promise<void> {
        await this.sendMessageToEntity(playerId, 'new_player_connexion', {
            status: status,
            message: '',
        });

        await this.sendMessageToEntity('0', 'new_player_connexion', {
            player_id: playerId,
        });
    }

    public async giveCardsToPlayerAtTheBeginningOfGame(playerId: string, cards: Card[]): Promise<void> {
        await this.sendMessageToEntity(playerId, 'player_cards_initialization', {
            cards,
        });
    }

    public async giveCardsToTableAtTheBeginningOfGame(stackCards: StackCard[]): Promise<void> {
        await this.sendMessageToEntity('0', 'table_cards_initialization', {
            stack_cards: stackCards,
        });
    }

    public async sendToTableCardsPlayedByPlayers(playerId: string, playedCard: Card): Promise<void> {
        await this.sendMessageToEntity('0', 'CARD_PLAYED_BY_USER', {
            player_id: playerId,
            played_cards: playedCard,
        });

        await this.sendMessageToEntity(playerId, 'CARD_PLAYED_BY_USER', {
            played_cards: playedCard,
        });
    }

    public async sendActionListToTable(actions: Action[]): Promise<void> {
        await this.sendMessageToEntity('0', 'NEW_ACTIONS', {actions: actions});
    }

    public async sendEndRoundDetailsToTable(stacks: StackCard[]): Promise<void> {
        await this.sendMessageToEntity('0', 'END_ROUND_DETAILS', {stacks: stacks});
    }

    public async sendEndRoundDetailsToPlayers(idPlayer: string, cards: Card[], playerNumberDiscard: number): Promise<void> {
        await this.sendMessageToEntity(idPlayer, 'END_ROUND_DETAILS', {cards: cards, discardValue: playerNumberDiscard});
    }

    public async sendNextRoundToTable(): Promise<void> {
        await this.sendMessageToEntity('0', 'NEXT_ROUND', {});
    }

    public async sendNextRoundToPlayer(playerId: string): Promise<void> {
        await this.sendMessageToEntity(playerId, 'NEXT_ROUND', {});
    }

    public async sendResultToTable(results: Result[]): Promise<void> {
        await this.sendMessageToEntity('0', 'RESULTS', {results: results});
    }

    public async sendResultToPlayer(results: Result[], playerId: string,): Promise<void> {
        await this.sendMessageToEntity(playerId, 'RESULTS', {results: results});
    }
    */
}
