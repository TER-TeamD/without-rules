import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../model/card.model';
import { GameService } from '../services/game.service';
import { WebsocketService } from '../services/websocket.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Result } from '../model/result.model';

@Component({
  selector: 'app-display-cards',
  templateUrl: './display-cards.component.html',
  styleUrls: ['./display-cards.component.css']
})
export class DisplayCardsComponent {

  public loading: boolean = true;
  public end: boolean = false;
  public played: boolean = false;
  public playerId: string = "";
  public cards: Card[] = [];
  public selectedCard: Card = this.cards[0];
  public result!: Result;

  constructor(private wsService: WebsocketService, private gameService: GameService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.playerId = params['playerId'];
    });

    this.gameService.playerCards$.subscribe(cards => {
      if (cards.length > 0) {
        console.log('cards', cards);
        this.cards = cards;
        this.loading = false;
        this.selectedCard = this.cards[0];
      }
    });

    this.wsService.listeningNextRound().subscribe((nextRound) => {
      if (nextRound) {
        this.played = false;
        this.selectedCard = this.cards[0];
      }
    });

    this.wsService.listeningResults().subscribe((results) => {
      if (results) {
        this.end = true;
        this.played = false;
        this.result = results.find((result) => result.id_player === this.playerId) as Result;
        console.log('result', this.result);
      }
    });
  }

  public selectCard(card: Card) {
    this.selectedCard = card;
  }

  public play() {
    let cardValue = this.selectedCard.value;

    this.gameService.playCard(this.playerId, cardValue).then(() => {
      console.log('Carte jouée', this.selectedCard);
      this.played = true;
      let cardToRemove = this.cards.indexOf(this.selectedCard);
      this.cards.splice(cardToRemove, 1);
    }
    ).catch((e) => {
      console.error(e);
    });

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

}
