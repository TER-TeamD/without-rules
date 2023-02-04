import {Inject, Injectable, OnInit} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Socket } from "socket.io-client/build/esm/socket";
import {Player} from "../model/player.model";
import {GameService} from "./game.service";


@Injectable({
  providedIn: 'root',
})
export class WebsocketService {

  // @ts-ignore
  private _socket: Socket;

  public playerLoggedInGame$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null);
  public startGame$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null)
  public cardPlayed$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null)
  public endGameResult$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(null)

  constructor() { }


  public async joinGame(playerId: string): Promise<void> {
    await this.connectPlayer(playerId);
    await this._socket.emit('PLAYER_JOIN_GAME', {player_id: playerId})
  }

  public async playerPlayedCard(playerId: string, cardValue: number): Promise<void> {
    await this._socket.emit('PLAYER_PLAYED_CARD', {player_id: playerId, card_value: cardValue})
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
  }






  private async connectPlayer(playerId: string): Promise<void> {
    this._socket = io('http://localhost:8451', {
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
