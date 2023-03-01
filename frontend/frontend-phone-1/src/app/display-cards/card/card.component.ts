import { state, style, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Card } from "../../model/player.model";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input()
  public card?: Card | null;
  @Input()
  public indicator?: boolean;

  public cattleHeadsLine1: string = "";
  public cattleHeadsLine2: string = "";
  public cattleHeadsIndicator: string = "";
  public numbers: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    let cattleHeads = this.card?.cattleHead || 0;
    this.cattleHeadsIndicator = "🐮".repeat(cattleHeads);
    this.numbers = Array(cattleHeads).fill(0);

    if (cattleHeads == 5) {
      this.cattleHeadsLine1 = "🐮🐮🐮";
      this.cattleHeadsLine2 = "🐮🐮";
    } else if (cattleHeads == 7) {
      this.cattleHeadsLine1 = "🐮🐮🐮🐮";
      this.cattleHeadsLine2 = "🐮🐮🐮";
    } else {
      this.cattleHeadsLine1 = "🐮".repeat(cattleHeads);
      this.cattleHeadsLine2 = "";
    }
  }

}
