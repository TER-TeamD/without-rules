import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "./auth.service";
import {WebsocketService} from "./websocket.service";
import {Card} from "../model/card.model";
import {ConnexionStatusEnum} from "../model/connexion-status.model";


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private _playerCards: Card[] = [];
  private _playerCards$: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>(this._playerCards);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private webSocketService: WebsocketService,
  ) { }

  public async joinGame(playerId: string): Promise<void> {
      this.authService.idPlayer = playerId;
      await this.webSocketService.connectPlayer(playerId);
      await this.webSocketService.playerJoinGame(playerId);

      this.webSocketService.listeningUserConnexion().subscribe(connexionStatus => {
        if (connexionStatus && connexionStatus.status === ConnexionStatusEnum.USER_IS_LOGGED) {
          // User connected
        } else {
          // Error : User not connected
          throw new Error("Cannot logged the user, this ID doesn't exist");
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

  public async playCard(playerId: string, cardValue: number): Promise<any> {
    return await this.webSocketService.sendNewPlayedCard(playerId, cardValue);
  }


  get playerCards$(): BehaviorSubject<Card[]> {
    return this._playerCards$;
  }
}
