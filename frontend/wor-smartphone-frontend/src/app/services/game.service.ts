import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "./auth.service";
import {WebsocketService} from "./websocket.service";


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private url: string = "http://localhost:8451/game-engine/player/";

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private webSocketService: WebsocketService,
  ) { }

  public joinGame(playerId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.authService.idPlayer = playerId;
      this.webSocketService.connectToSocket();


      this.httpClient.post(this.url + playerId + "/join-game", null).subscribe(r => {
        resolve();
      }, e => {
        reject();
      });
    })

  }

  public playCard(playerId: string, cardValue: number) {
    return this.httpClient.post(this.url + playerId + "/play-card", { card_value: cardValue });
  }
}
