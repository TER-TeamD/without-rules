import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { Card, Player } from "../model/player.model";
import { Subscription } from "rxjs";
import { LastMessageEnum } from "../model/last-message.enum";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-cards',
  templateUrl: './display-cards.component.html',
  styleUrls: ['./display-cards.component.css'],
  animations: [
    trigger('cardAnimation', [
      state('selected', style({
        transform: 'scale(' + window.innerHeight / 300 + ')',
        top: '40%'
      })),
      state('unselected', style({
        transform: 'rotate({{degree}}deg) translate(0, -80%)',
      }), { params: { degree: 0 } }),
      transition('unselected => selected', animate('800ms ease-in')),
      transition('selected => unselected', animate('800ms ease-out')),
      state('played', style({
        transform: 'translateY(-100vh)'
      })),
      transition('* => played', animate('500ms ease-in')),
    ])
  ]
})
export class DisplayCardsComponent implements OnInit, OnDestroy {
  public gameStatus: string = "PLAYING";
  private lastMessageSubscription: Subscription | null = null;
  private playerSubscription: Subscription | null = null;
  public player: Player | null = null;
  public selectedCard: Card | null = null;
  public timer: number = 60;
  public cards: Card[] = [];

  constructor(private gameService: GameService, private router: Router) {
  }

  ngOnInit(): void {

    setInterval(() => {
      let end = new Date(this.player?.in_player_game_property?.chrono_up_to).getTime();
      let now = new Date().getTime();
      this.timer = Math.floor((end - now) / 1000) + 1;
    }, 1000);

    this.lastMessageSubscription = this.gameService.lastMessage$.subscribe(async lastMessage => {

      if (lastMessage === LastMessageEnum.CARD_PLAYED) {
        console.log("Card played");
        await this.router.navigate(['/table']);
      }
    });

    this.playerSubscription = this.gameService.player$.subscribe(async player => {
      console.log("New player value", player)
      this.player = player;
      if (this.player === null) {
        this.router.navigate(['/']);
      }

      this.cards = this.player!.cards.sort((a, b) => (a.value > b.value) ? 1 : -1);
      this.cards.forEach(c => c.state = 'unselected');
      this.selectedCard = null;
      if (this.cards.length === 1) {
        this.select(this.cards[0]);
        this.cards[0].state = 'selected';
      }
    })
  }


  public play(): void {
    if (this.player && this.selectedCard) {
      this.cards.forEach(c => c.state = c === this.selectedCard ? 'played' : 'unselected');
      setTimeout(() => {
        this.gameService.playerPlayedCard(this.player!.id, this.selectedCard!.value);
      }, 1000);
    }
  }

  select(card: Card) {
    this.selectedCard = card;
    this.cards.forEach(c => c.state = c === card ? 'selected' : 'unselected');
  }

  public cancel(): void {
    this.selectedCard = null;
    this.cards.forEach(c => c.state = 'unselected');
  }

  ngOnDestroy(): void {
    this.lastMessageSubscription?.unsubscribe();
    this.playerSubscription?.unsubscribe();
  }
}
