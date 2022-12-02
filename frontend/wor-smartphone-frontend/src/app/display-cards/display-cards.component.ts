import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public loading: boolean = true;

  constructor(private wsService: WebsocketService, private gameService: GameService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      wsService.getCards(params["playerId"]).subscribe(
        (data) => {
          console.log(data);
          this.gameCards = data;
          this.loading = false;
        }
      );
    });
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
