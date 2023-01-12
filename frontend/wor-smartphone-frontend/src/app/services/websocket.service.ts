import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Socket } from "socket.io-client/build/esm/socket";
import { Card } from "../model/card.model";
import { ConnexionStatusMessage } from "../model/connexion-status.model";
import { Result } from '../model/result.model';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // @ts-ignore
  private _socket: Socket;

  private _playerCards$: BehaviorSubject<Card[] | null> = new BehaviorSubject<Card[] | null>(null);
  private _playerAuthentification$: BehaviorSubject<ConnexionStatusMessage | null> = new BehaviorSubject<ConnexionStatusMessage | null>(null);
  private _nextRound$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _results$: BehaviorSubject<Result[] | null> = new BehaviorSubject<Result[] | null>(null);


  constructor() { }

  public listeningUserConnexion(): Observable<ConnexionStatusMessage | null> {
    this._socket.on('new_player_connexion', (message: ConnexionStatusMessage) => {
      this._playerAuthentification$.next(message);
    });

    return this._playerAuthentification$.asObservable();
  }

  public listeningNewPlayerCards(): Observable<Card[] | null> {
    this._socket.on('player_cards_initialization', (message: { cards: Card[] }) => {
      this._playerCards$.next(message.cards);
      console.log(message.cards)
    });

    return this._playerCards$.asObservable();
  }

  public listeningNextRound(): Observable<boolean> {
    this._socket.on('NEXT_ROUND', (message) => {
      this._nextRound$.next(true);
    });

    return this._nextRound$.asObservable();
  }

  public listeningResults(): Observable<Result[] | null> {
    this._socket.on('RESULTS', (message) => {
      console.log(message.results);
      this._results$.next(message.results);
    });

    return this._results$.asObservable();
  }

  public async sendNewPlayedCard(playerId: string, cardValue: number): Promise<any> {
    return this._socket.emit('player_play_card', { player_id: playerId, body: { card_value: cardValue } });
  }

  public async playerJoinGame(playerId: string) {
    return this._socket.emit('player_join_game', { player_id: playerId })
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
