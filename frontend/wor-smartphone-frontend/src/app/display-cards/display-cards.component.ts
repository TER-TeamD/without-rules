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

  public gameCards?: GameCards;
  public select: boolean = false;
  public loading: boolean = true;
  public played: boolean = false;
  public cardsArray: Card[] = [];
  public selectedCard: Card = this.cardsArray[0];

  constructor(private wsService: WebsocketService, private gameService: GameService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loading = false;
    this.played = true;
    // this.cardsArray = [
    //   { value: 1, cattleHead: 1 },
    //   { value: 2, cattleHead: 2 },
    //   { value: 3, cattleHead: 3 },
    //   { value: 4, cattleHead: 4 }
    // ];

    this.route.params.subscribe(params => {
      this.wsService.connect(params["playerId"]).subscribe(
        (data) => {
          console.log('data', data);
          this.gameCards = data;
          this.loading = false;
          this.cardsArray = this.gameCards?.value?.cards;
        }
      );
    });
  }

  public selectCard(card: Card) {
    console.log('Carte sélectionnée', card);
    this.selectedCard = card;
    this.select = true;
  }

  public play() {
    let playerId = this.gameCards?.value?.id_player;
    let cardValue = this.gameCards?.value?.cards[0].value;
    this.gameService.playCard(playerId!, cardValue!).subscribe(
      () => {
        console.log('Carte jouée', this.selectedCard);
        this.played = true;
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cardsArray, event.previousIndex, event.currentIndex);
  }

}
