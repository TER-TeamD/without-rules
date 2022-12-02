import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../model/card.model';
import { GameCards } from '../model/gamecards';
import { GameService } from '../services/game.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-display-cards',
  templateUrl: './display-cards.component.html',
  styleUrls: ['./display-cards.component.css']
})
export class DisplayCardsComponent {

  public gameCards?: GameCards;
  public selectedCard?: Card;
  public select: boolean = false;
  public loading: boolean = true;

  constructor(private wsService: WebsocketService, private gameService: GameService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.wsService.connect(params["playerId"]).subscribe(
        (data) => {
          console.log(data);
          this.gameCards = data;
          this.loading = false;
        }
      );
    });
  }

  ngOnInit(): void {
  }

  public selectCard(card: Card) {
    this.selectedCard = card;
    this.select = true;
  }

  public play() {
    let playerId = this.gameCards?.value?.id_player;
    let cardValue = this.gameCards?.value?.cards[0].value;
    this.gameService.playCard(playerId!, cardValue!).subscribe(
      () => {
        console.log('Carte jouée');
      }
    );
  }


}
