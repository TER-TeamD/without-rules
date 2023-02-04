import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../services/game.service';
import { WebsocketService } from '../services/websocket.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Card} from "../model/player.model";

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
  public result = null;

  public ranks: String[] = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "nineth", "tenth"];

  constructor(private wsService: WebsocketService, private gameService: GameService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.playerId = params['playerId'];
    });
  }

  public selectCard(card: Card) {
    this.selectedCard = card;
  }

  public play() {
    let cardValue = this.selectedCard.value;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

}
