import {forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger} from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {GameEngineService} from "./game-engine.service";
import {AnyGameFoundException, AnyPlayerFoundException} from "../exceptions/exeptions-handler";
import {NewGameDto} from "../dto/new-game.dto";
import {ConnexionStatusEnum} from "../schema/manager.enums";


@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    private entitiesConnected: {} = {}; // socket_id: string, type: string
    private readonly logger: Logger = new Logger(WebsocketGateway.name);


    constructor(
        @Inject(forwardRef(() => GameEngineService)) private readonly gameEngineService: GameEngineService
    ) {}

    afterInit(server: Server): any {
        this.logger.log('Init');
    }

    handleConnection(client: Socket): any {
        this.logger.log(`Client connected: ${client.handshake.auth.id}, type : ${client.handshake.auth.type}`);
        this.entitiesConnected[client.handshake.auth.id] = {socket_id: client.id, type: client.handshake.auth.type};

        this.server.to(client.id).emit('connection_status_server', {"status": "Connection established"})
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
    public tableStartGame(client: Socket, payload: any): void {
        this.logger.log(`Table start game -> ID : ${this.entitiesConnected[client.handshake.auth.id]} : ${payload} `);
    }

    @SubscribeMessage('player_play_card')
    public playerPlayCard(client: Socket, payload: any): void {
        this.logger.log(`Player play card -> ID : ${this.entitiesConnected[client.handshake.auth.id]} : ${payload} `);
    }


    @SubscribeMessage('message_topic_1')
    public handleMessage(client: Socket, payload: any): void {
        this.logger.log(`New message from one client with ID ${this.entitiesConnected[client.handshake.auth.id]} : ${payload}`);
    }


    public async sendInitializationInformationsToTable(newGameDto: NewGameDto): Promise<void> {
        await this.sendMessageToEntity("0", "player_initialization", newGameDto);
    }

    public async sendConfirmationMessageToPlayerWhenPlayerTriedToConnectToGame(status: ConnexionStatusEnum, playerId: string): Promise<void> {
        await this.sendMessageToEntity(playerId, 'new_player_connexion', {status: status, message: ""});
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
