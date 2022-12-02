import { Component } from '@angular/core';
import { GameCards } from '../model/gamecards';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-display-cards',
  templateUrl: './display-cards.component.html',
  styleUrls: ['./display-cards.component.css']
})
export class DisplayCardsComponent {

  public gameCards?: GameCards;
  public loading: boolean = true;

  constructor(private wsService: WebsocketService) {
    wsService.getCards().subscribe(
      (data) => {
        console.log(data);
        this.gameCards = data;
        this.loading = false;
      }
    );
  }




}
