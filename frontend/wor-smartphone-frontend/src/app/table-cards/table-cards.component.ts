import { Component } from '@angular/core';
import { StackCard } from '../model/game.model';
import { Player } from '../model/player.model';
import { GameService } from '../services/game.service';
import Stacks from './mocks/stacks.json';
import Players from './mocks/players.json';
import { LastGameMessageEnum, LastMessageEnum } from '../model/last-message.enum';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-cards',
  templateUrl: './table-cards.component.html',
  styleUrls: ['./table-cards.component.css']
})
export class TableCardsComponent {
  public gameStatus = "WAITING";
  private lastMessageSubscription: Subscription | null = null;
  private lastGameMessageSubscription: Subscription | null = null;
  private playerSubscription: Subscription | null = null;
  public player: Player | null = null;
  public players: Player[] = [];
  public stacks: StackCard[] = [];
  public canChooseStack: boolean = false;
  public timer: number = 30;
  public timerVisible: boolean = false;
  public messageVisible: boolean = false;
  // public players: any[] = Players;
  // public stacks: any[] = Stacks;

  constructor(private gameService: GameService, private router: Router) {
  }


  ngOnInit(): void {

    this.lastMessageSubscription = this.gameService.lastMessage$.subscribe(async lastMessage => {

      if (lastMessage === LastMessageEnum.END_GAME_RESULTS) {
        console.log("End result");
        this.router.navigate(['/end']);
      }

      if (lastMessage === LastMessageEnum.NEW_ROUND) {
        console.log("New Round");
        await this.router.navigate(['/cards']);
      }
    });

    this.playerSubscription = this.gameService.player$.subscribe(async player => {
      console.log("New player value", player)
      this.player = player;
      if (this.player === null) {
        this.router.navigate(['/']);
      }
    })

    this.lastGameMessageSubscription = this.gameService.lastGameMessage$.subscribe(lastMessage => {
      console.log("game", this.gameService.game);
      console.log("lastMessage", lastMessage)
      if (lastMessage === LastGameMessageEnum.PHONE_NEW_PLAYER_PLAYED_CARD) {
        let currentGame = this.gameService.game;
        if (currentGame) {
          this.stacks = currentGame.in_game_property.stacks;
          this.players = currentGame.players;
          for (let p of this.players) {
            p.in_player_game_property = null;
          }
        }

      }


      if (lastMessage === LastGameMessageEnum.PHONE_FLIP_CARD_ORDER) {
        let currentGame = this.gameService.game;
        if (currentGame) {
          this.stacks = currentGame.in_game_property.stacks;
          this.players = currentGame.players;
        }
      }

      if (lastMessage === LastGameMessageEnum.PHONE_NEW_RESULT_ACTION) {
        let currentPlayerAction = this.gameService.game?.in_game_property.between_round?.current_player_action;

        if (currentPlayerAction?.action.type === "CHOOSE_STACK_CARD" && currentPlayerAction.player.id === this.player?.id) {
          setInterval(() => {
            let end = new Date(currentPlayerAction?.action.chrono_up_to).getTime();
            let now = new Date().getTime();
            this.timer = Math.floor((end - now) / 1000) + 1;
            if (this.timer === 0) {
              this.canChooseStack = false;
              this.timerVisible = false;
              this.messageVisible = false;
            }
          }, 1000);
          this.canChooseStack = true;
          this.timerVisible = true;
          this.messageVisible = true;
        }
      }


    });

  }

  public countCattleHeads(stack: StackCard): number {
    let cattleHeads = stack.stackHead.cattleHead;
    stack.stackCards.forEach(card => {
      cattleHeads += card.cattleHead;
    });
    return cattleHeads;
  }

  chooseStack(n: number) {
    this.gameService.tableNextRoundResultAction(n);
    this.canChooseStack = false;
    this.timerVisible = false;
    this.messageVisible = false;
  }

  ngOnDestroy(): void {
    this.lastMessageSubscription?.unsubscribe();
    this.playerSubscription?.unsubscribe();
    this.lastGameMessageSubscription?.unsubscribe();
  }
}
