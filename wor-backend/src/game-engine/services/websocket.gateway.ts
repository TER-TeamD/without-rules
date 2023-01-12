import { Body, forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger, Param } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameEngineService } from "./game-engine.service";
import { AnyGameFoundException, AnyPlayerFoundException } from "../exceptions/exeptions-handler";
import { NewGameDto } from "../dto/new-game.dto";
import { ConnexionStatusEnum } from "../schema/manager.enums";
import { Action, Card, Result, StackCard } from "../schema/game.schema";
import { PlayedCardDto } from "../dto/played-card.dto";


@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    private entitiesConnected: {} = {}; // socket_id: string, type: string
    private readonly logger: Logger = new Logger(WebsocketGateway.name);


    constructor(
        @Inject(forwardRef(() => GameEngineService)) private readonly gameEngineService: GameEngineService
    ) { }

    afterInit(server: Server): any {
        this.logger.log('Init');
    }

    handleConnection(client: Socket): any {
        this.logger.log(`Client connected: ${client.handshake.auth.id}, type : ${client.handshake.auth.type}`);
        this.entitiesConnected[client.handshake.auth.id] = { socket_id: client.id, type: client.handshake.auth.type };

        this.server.to(client.id).emit('connection_status_server', { "status": "Connection established" })
    }

    handleDisconnect(client: Socket): any {
        delete this.entitiesConnected[client.handshake.auth.id];
        this.logger.log(`Client disconnected: ${client.id}`);
    }




    @SubscribeMessage('table_create_game')
    public async tableCreateGame(client: Socket, payload: any): Promise<void> {
        this.logger.log(`Creation new game by a table -> ID : ${JSON.stringify(this.entitiesConnected[client.handshake.auth.id])} : ${JSON.stringify(payload)}`);
        await this.gameEngineService.createNewGame();
    }

    @SubscribeMessage('player_join_game')
    public async playerJoinGame(client: Socket, payload: any): Promise<void> {
        const message: { player_id: string } = payload;
        this.logger.log(`Player join game -> ID : ${JSON.stringify(this.entitiesConnected[client.handshake.auth.id])} : ${JSON.stringify(payload)} `);
        await this.gameEngineService.playerJoinGame(message.player_id);
    }

    @SubscribeMessage('table_start_game')
    public async tableStartGame(client: Socket, payload: any): Promise<void> {
        this.logger.log(`Table start game -> ID : ${JSON.stringify(this.entitiesConnected[client.handshake.auth.id])} : ${JSON.stringify(payload)} `);
        await this.gameEngineService.startGame();
    }

    @SubscribeMessage('player_play_card')
    public async playerPlayCard(client: Socket, payload: any): Promise<void> {
        const message: { player_id: string, body: PlayedCardDto } = payload;
        this.logger.log(`Player play card -> ID : ${JSON.stringify(this.entitiesConnected[client.handshake.auth.id])} : ${JSON.stringify(payload)} `);
        await this.gameEngineService.playerPlayedACard(message.body, message.player_id);
    }




    public async sendInitializationInformationsToTable(newGameDto: NewGameDto): Promise<void> {
        await this.sendMessageToEntity("0", "player_initialization", newGameDto);
    }

    public async sendConfirmationMessageToPlayerWhenPlayerTriedToConnectToGame(status: ConnexionStatusEnum, playerId: string): Promise<void> {
        await this.sendMessageToEntity(playerId, 'new_player_connexion', { status: status, message: "" });
    }

    public async giveCardsToPlayerAtTheBeginningOfGame(playerId: string, cards: Card[]): Promise<void> {
        await this.sendMessageToEntity(playerId, 'player_cards_initialization', { cards });
    }

    public async giveCardsToTableAtTheBeginningOfGame(stackCards: StackCard[]): Promise<void> {
        await this.sendMessageToEntity("0", 'table_cards_initialization', { stack_cards: stackCards });
    }

    public async sendToTableCardsPlayedByPlayers(playerId: string, playedCard: Card,): Promise<void> {
        await this.sendMessageToEntity("0", 'CARD_PLAYED_BY_USER', { player_id: playerId, played_cards: playedCard, });
    }

    public async sendActionListToTable(actions: Action[]): Promise<void> {
        await this.sendMessageToEntity("0", 'NEW_ACTIONS', { actions: actions, });
    }

    public async sendNextRoundToTable(): Promise<void> {
        await this.sendMessageToEntity("0", 'NEXT_ROUND', {});
    }

    public async sendNextRoundToPlayer(playerId: string): Promise<void> {
        await this.sendMessageToEntity(playerId, 'NEXT_ROUND', {});
    }

    public async sendResultToTable(results: Result[]): Promise<void> {
        await this.sendMessageToEntity("0", 'RESULTS', { results: results, });
    }

    public async sendResultToPlayer(results: Result[], playerId: string): Promise<void> {
        await this.sendMessageToEntity(playerId, 'RESULTS', { results: results, });
    }















    private async sendMessageToEntity(id: string, topic: string, message: any): Promise<void> {
        const idUser = this.entitiesConnected[id].socket_id;

        if (idUser != null) {
            this.server.to(idUser).emit(topic, message);
        } else {
            throw new HttpException(`The entity ${id} is not connected`, HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }



}
