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

  constructor() { }


  public async joinGame(playerId: string): Promise<void> {
    await this.connectPlayer(playerId);
    await this._socket.emit('PLAYER_JOIN_GAME', {player_id: playerId})
  }

  private async initListeners(): Promise<void> {
    this._socket.on('PLAYER_LOGGED_IN_GAME', async (message: { player: Player }) => {
      this.playerLoggedInGame$.next(message.player);
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
