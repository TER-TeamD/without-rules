import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../services/game.service';
import { WebsocketService } from '../services/websocket.service';
import { CdkDragDrop, CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';
import { Card, Player, PlayerGameResult } from "../model/player.model";
import { Subscription } from "rxjs";
import { LastMessageEnum } from "../model/last-message.enum";

@Component({
  selector: 'app-display-cards',
  templateUrl: './display-cards.component.html',
  styleUrls: ['./display-cards.component.css']
})
export class DisplayCardsComponent implements OnInit, OnDestroy {

  private lastMessageSubscription: Subscription | null = null;
  private playerSubscription: Subscription | null = null;

  public player: Player | null = null;
  public loading: boolean = true;
  public end: boolean = false;
  public played: boolean = false;
  public selectedCard: Card | null = null;
  public urlAvatar: string = "";
  public cards: Card[] = [];
  public cattleHeads: number = 0;


  public ranks: String[] = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "nineth", "tenth"];

  // public cards: Card[] = [{ value: 30, cattleHead: 1 }, { value: 77, cattleHead: 2 }, { value: 12, cattleHead: 3 },
  // { value: 89, cattleHead: 1 }, { value: 27, cattleHead: 5 }, { value: 34, cattleHead: 2 }, { value: 56, cattleHead: 3 },
  // { value: 90, cattleHead: 1 }, { value: 23, cattleHead: 5 }, { value: 45, cattleHead: 2 }];


  constructor(private wsService: WebsocketService, private gameService: GameService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.lastMessageSubscription = this.gameService.lastMessage$.subscribe(async lastMessage => {


      if (lastMessage === LastMessageEnum.START_GAME) {
        console.log("Start game")
        this.loading = false;
      }

      if (lastMessage === LastMessageEnum.CARD_PLAYED) {
        console.log("Card played")
        this.played = true;
      }

      if (lastMessage === LastMessageEnum.END_GAME_RESULTS) {
        console.log("End result");
        this.end = true;
        this.played = false;
      }

      if (lastMessage === LastMessageEnum.NEW_ROUND) {
        console.log("New Round");
        this.end = false;
        this.loading = false;
        this.played = false;
      }

    });

    this.playerSubscription = this.gameService.player$.subscribe(async player => {
      console.log("New player value", player)
      this.player = player;
      this.cards = this.player!.cards.sort((a, b) => (a.value > b.value) ? 1 : -1);
      this.player?.in_player_game_property?.player_discard.forEach(card => this.cattleHeads += card.cattleHead);
      this.urlAvatar = `/assets/avatars/${this.player?.avatar}.png`;


      if (this.player) {
        this.selectedCard = this.player.cards[0] ? this.player.cards[0] : null;
      }
    })

  }

  public selectCard(card: Card) {
    this.selectedCard = card;
  }

  public async play(): Promise<void> {
    if (this.player && this.selectedCard) {
      console.log("play card")
      await this.gameService.playerPlayedCard(this.player.id, this.selectedCard.value)
    }
  }

  entered(event: CdkDragEnter) {
    moveItemInArray(this.cards, event.item.data, event.container.data);
  }

  ngOnDestroy(): void {
    this.lastMessageSubscription?.unsubscribe();
    this.playerSubscription?.unsubscribe();
  }

}
