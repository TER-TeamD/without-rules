import { Component, Input } from '@angular/core';
import { Player } from '../model/player.model';

@Component({
  selector: 'app-table-cards',
  templateUrl: './table-cards.component.html',
  styleUrls: ['./table-cards.component.css']
})
export class TableCardsComponent {

  @Input() player: Player | null = null;

}
