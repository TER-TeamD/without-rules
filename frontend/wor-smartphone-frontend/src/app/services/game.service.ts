import {Injectable, OnInit} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {WebsocketService} from "./websocket.service";
import {Player} from "../model/player.model";
import {LastMessageEnum} from "../model/last-message.enum";


@Injectable({
  providedIn: 'root',
})
export class GameService {

  public player: Player | null = null;
  public player$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(this.player)

  public lastMessage: LastMessageEnum | null = null;
  public lastMessage$: BehaviorSubject<LastMessageEnum | null> = new BehaviorSubject<LastMessageEnum | null>(this.lastMessage);

  constructor(private webSocketService: WebsocketService) {
    this.webSocketService.playerLoggedInGame$.subscribe(p => {
      this.updatePlayer(p);
      this.updateLastMessage(LastMessageEnum.PLAYER_LOGGED_IN_GAME);
    });

    this.webSocketService.startGame$.subscribe(p => {
      this.updatePlayer(p);
      this.updateLastMessage(LastMessageEnum.START_GAME);
    });

    this.webSocketService.cardPlayed$.subscribe(p => {
      this.updatePlayer(p);
      this.updateLastMessage(LastMessageEnum.CARD_PLAYED);
    });

    this.webSocketService.endGameResult$.subscribe(p => {
      this.updatePlayer(p);
      this.updateLastMessage(LastMessageEnum.END_GAME_RESULTS);
    });

    this.webSocketService.newRound$.subscribe(p => {
      this.updatePlayer(p);
      this.updateLastMessage(LastMessageEnum.NEW_ROUND);
    });
  }


  public async joinGame(playerId: string): Promise<void> {
    await this.webSocketService.joinGame(playerId);
  }

  public async playerPlayedCard(playerId: string, cardValue: number): Promise<void> {
    await this.webSocketService.playerPlayedCard(playerId, cardValue)
  }


  private updatePlayer(player: Player | null): void {
    this.player = player;
    this.player$.next(player);
  }

  private updateLastMessage(lastMessage: LastMessageEnum): void {
    this.lastMessage = lastMessage;
    this.lastMessage$.next(this.lastMessage);
  }





}
