import { Component } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-display-cards',
  templateUrl: './display-cards.component.html',
  styleUrls: ['./display-cards.component.css']
})
export class DisplayCardsComponent {

  public card: string[] = [];
  public loading: boolean = true;
  public playerId: string = "";

  constructor(private wsService: WebsocketService) {
    wsService.getCards().subscribe(
      (data) => {
        console.log(data);
        this.loading = false;
        this.playerId = data.value.player_id;
        this.card

      }
    );
  }
}
