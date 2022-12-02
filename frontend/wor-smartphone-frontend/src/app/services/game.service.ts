import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private url: string = "http://localhost:8451/game-engine/player/";

  constructor(private httpClient: HttpClient) { }

  public joinGame(playerId: string) {
    return this.httpClient.post(this.url + playerId + "/join-game", null);
  }

  public playCard(playerId: string, cardValue: number) {
    return this.httpClient.post(this.url + playerId + "/play-card", { card_value: cardValue });
  }
}