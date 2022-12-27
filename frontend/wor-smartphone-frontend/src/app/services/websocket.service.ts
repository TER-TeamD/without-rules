import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import { io } from 'socket.io-client';
import { GameCards } from '../model/gamecards';
import {Socket} from "socket.io-client/build/esm/socket";
import {AuthService} from "./auth.service";
import {GameService} from "./game.service";
import {Card} from "../model/card.model";
import {ConnexionStatusMessage} from "../model/connexion-status.model";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // @ts-ignore
  private _socket: Socket;

  private _playerCards$: BehaviorSubject<Card[] | null> = new BehaviorSubject<Card[] | null>(null);
  private _playerAuthentification$: BehaviorSubject<ConnexionStatusMessage | null> = new BehaviorSubject<ConnexionStatusMessage | null>(null);

  constructor() {}

  public listeningUserConnexion(): Observable<ConnexionStatusMessage | null> {
    this._socket.on('new_player_connexion', (message: ConnexionStatusMessage) => {
      this._playerAuthentification$.next(message);
    });

    return this._playerAuthentification$.asObservable();
  }

  public listeningNewPlayerCards(): Observable<Card[] | null> {
    this._socket.on('player_cards_initialization', (message: {cards: Card[]}) => {
      this._playerCards$.next(message.cards);
      console.log(message.cards)
    });

    return this._playerCards$.asObservable();
  }

  public async sendNewPlayedCard(playerId: string, cardValue: number): Promise<any> {
    return this._socket.emit('player_play_card', {player_id: playerId, card_value: cardValue});
  }

  public async playerJoinGame(playerId: string) {
    return this._socket.emit('player_join_game', {player_id: playerId})
  }

  public async connectPlayer(playerId: string): Promise<void> {
    this._socket = io('http://localhost:8451', {
      autoConnect: false,
      auth: {
        id: playerId,
        type: "PLAYER",
      }
    });

    await this._socket.disconnect().connect();
  }
}
