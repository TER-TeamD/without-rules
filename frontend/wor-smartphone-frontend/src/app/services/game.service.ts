import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {WebsocketService} from "./websocket.service";
import {Player} from "../model/player.model";
import {LastGameMessageEnum, LastMessageEnum} from "../model/last-message.enum";
import {Game} from "../model/game.model";


@Injectable({
  providedIn: 'root',
})
export class GameService {

  public player: Player | null = null;
  public player$: BehaviorSubject<Player | null> = new BehaviorSubject<Player | null>(this.player)

  public lastMessage: LastMessageEnum | null = null;
  public lastMessage$: BehaviorSubject<LastMessageEnum | null> = new BehaviorSubject<LastMessageEnum | null>(this.lastMessage);

  public game: Game | null = null;
  public game$: BehaviorSubject<Game | null> = new BehaviorSubject<Game | null>(this.game);

  public lastGameMessage: LastGameMessageEnum | null = null;
  public lastGameMessage$: BehaviorSubject<LastGameMessageEnum | null> = new BehaviorSubject<LastGameMessageEnum | null>(this.lastGameMessage);

  constructor(private webSocketService: WebsocketService) {

    /* Phone */
    /**********************************************************************/
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


    /* Table */
    /**********************************************************************/
    this.webSocketService.newPlayerPlayedCard$.subscribe(g => {
      this.updateGame(g);
      this.updateLastGameMessage(LastGameMessageEnum.PHONE_NEW_PLAYER_PLAYED_CARD);
    });

    this.webSocketService.flipCardOrder$.subscribe(g => {
      this.updateGame(g);
      this.updateLastGameMessage(LastGameMessageEnum.PHONE_FLIP_CARD_ORDER);
    });

    this.webSocketService.newResultAction$.subscribe(g => {
      this.updateGame(g);
      this.updateLastGameMessage(LastGameMessageEnum.PHONE_NEW_RESULT_ACTION);
    });
  }

  /* Player */
  public async joinGame(playerId: string, username: string): Promise<void> {
    await this.webSocketService.joinGame(playerId, username);
  }

  /* Player */
  public async playerPlayedCard(playerId: string, cardValue: number): Promise<void> {
    await this.webSocketService.playerPlayedCard(playerId, cardValue)
  }

  /* Game (table) */
  public async tableNextRoundResultAction(choosen_stack: number | null): Promise<void> {
    await this.webSocketService.tableNextRoundResultAction(choosen_stack);
  }



  private updatePlayer(player: Player | null): void {
    this.player = player;
    this.player$.next(player);
  }

  private updateLastMessage(lastMessage: LastMessageEnum): void {
    this.lastMessage = lastMessage;
    this.lastMessage$.next(this.lastMessage);
  }

  private updateGame(game: Game | null): void {
    this.game = game;
    this.game$.next(game);
  }

  private updateLastGameMessage(lastMessage: LastGameMessageEnum): void {
    this.lastGameMessage = lastMessage;
    this.lastGameMessage$.next(this.lastGameMessage);
  }
}
