import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError } from "rxjs";
import { AuthService } from "./auth.service";
import { WebsocketService } from "./websocket.service";
import { Card } from "../model/card.model";
import { ConnexionStatusEnum } from "../model/connexion-status.model";
import { Router } from "@angular/router";
import { Result } from "../model/result.model";


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private _playerCards: Card[] = [];
  private _playerCards$: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>(this._playerCards);
  private _connected$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private webSocketService: WebsocketService
  ) { }


  public async joinGame(playerId: string) {
    this.authService.idPlayer = playerId;
    await this.webSocketService.connectPlayer(playerId);
    await this.webSocketService.playerJoinGame(playerId);

    this.webSocketService.listeningUserConnexion().subscribe(connexionStatus => {
      console.log(connexionStatus)
      if (connexionStatus && connexionStatus.status === ConnexionStatusEnum.USER_IS_LOGGED) {
        // User connected
        this._connected$.next(true);
      }
    })

    this.webSocketService.listeningNewPlayerCards().subscribe(newCards => {
      if (newCards) {
        this._playerCards = newCards;
        this._playerCards$.next(this._playerCards);
      } else {
        // Any cards found
      }
    })
  }


  public isConnected(): BehaviorSubject<Boolean> {
    return this._connected$;
  }


  public async playCard(playerId: string, cardValue: number): Promise<any> {
    return await this.webSocketService.sendNewPlayedCard(playerId, cardValue);
  }


  get playerCards$(): BehaviorSubject<Card[]> {
    return this._playerCards$;
  }

}
