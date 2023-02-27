import { Inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Socket } from "socket.io-client/build/esm/socket";
import { Player } from "../model/player.model";
import { GameService } from "./game.service";
import { PROD } from "../config";
import {Game} from "../model/game.model";


@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  private URL: string = PROD ? "https://backend-ter.cryptoservice.tech/" : "http://localhost:8451"

  // @ts-ignore
  private _socket: Socket;

  public playerLoggedInGame$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null);
  public startGame$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null);
  public cardPlayed$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null);
  public endGameResult$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null);
  public newRound$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null);

  public newPlayerPlayedCard$: BehaviorSubject<Game | null> = new BehaviorSubject<Game | null>(null);
  public flipCardOrder$: BehaviorSubject<Game | null> = new BehaviorSubject<Game | null>(null);
  public newResultAction$: BehaviorSubject<Game | null> = new BehaviorSubject<Game | null>(null);
  public newStartGameValue$: BehaviorSubject<Game | null> = new BehaviorSubject<Game | null>(null);




  constructor() { }


  public async joinGame(playerId: string, username: string): Promise<void> {
    await this.connectPlayer(playerId);
    await this._socket.emit('PLAYER_JOIN_GAME', { player_id: playerId, username: username })
  }

  public async playerPlayedCard(playerId: string, cardValue: number): Promise<void> {
    this._socket.emit('PLAYER_PLAYED_CARD', { player_id: playerId, card_value: cardValue });
  }

  public async tableNextRoundResultAction(choosen_stack: number | null): Promise<void> {
    this._socket.emit('TABLE_NEXT_ROUND_RESULT_ACTION', { choosen_stack: choosen_stack });
  }

  private async initListeners(): Promise<void> {
    this._socket.on('PLAYER_LOGGED_IN_GAME', async (message: { player: Player }) => {
      this.playerLoggedInGame$.next(message.player);
    });

    this._socket.on('START_GAME', async (message: { player: Player }) => {
      this.startGame$.next(message.player);
    });

    this._socket.on('CARD_PLAYED', async (message: { player: Player }) => {
      this.cardPlayed$.next(message.player);
    });

    this._socket.on('END_GAME_RESULTS', async (message: { player: Player }) => {
      this.endGameResult$.next(message.player);
    });

    this._socket.on('NEW_ROUND', async (message: { player: Player }) => {
      this.newRound$.next(message.player);
    });



    this._socket.on('PHONE_NEW_PLAYER_PLAYED_CARD', async (message: { game: Game }) => {
      this.newPlayerPlayedCard$.next(message.game);
    });
    this._socket.on('PHONE_FLIP_CARD_ORDER', async (message: { game: Game }) => {
      this.flipCardOrder$.next(message.game);
    });
    this._socket.on('PHONE_NEW_RESULT_ACTION', async (message: { game: Game }) => {
      this.newResultAction$.next(message.game);
    });
    this._socket.on('START_GAME_VALUE', async (message: { game: Game }) => {
      this.newStartGameValue$.next(message.game);
    });


  }






  private async connectPlayer(playerId: string): Promise<void> {
    this._socket = io(this.URL, {
      autoConnect: false,
      auth: {
        id: playerId,
        type: "PLAYER",
      }
    });

    await this._socket.disconnect().connect();
    await this.initListeners();
  }
}
