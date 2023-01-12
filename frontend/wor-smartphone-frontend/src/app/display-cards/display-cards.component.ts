import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../model/card.model';
import { GameCards } from '../model/gamecards';
import { GameService } from '../services/game.service';
import { WebsocketService } from '../services/websocket.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-display-cards',
  templateUrl: './display-cards.component.html',
  styleUrls: ['./display-cards.component.css']
})
export class DisplayCardsComponent {

  public select: boolean = false;
  public loading: boolean = true;
  public played: boolean = false;
  public playerId: string = "";
  public cards: Card[] = [];
  public selectedCard: Card = this.cards[0];

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
      }
    });

    this.wsService.listeningNextRound().subscribe((nextRound) => {
      if (nextRound) {
        this.select = false;
        this.played = false;
        this.selectedCard = this.cards[0];
      }
    });
  }

  public selectCard(card: Card) {
    this.selectedCard = card;
    this.select = true;
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
