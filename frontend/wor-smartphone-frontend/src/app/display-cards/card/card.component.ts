import { Component, Input } from '@angular/core';
import { Card } from 'src/app/model/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input()
  public card?: Card;

  public cattleHeadsLine1: string = "";
  public cattleHeadsLine2: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    let cattleHeads = this.card?.cattleHead || 0;

    if (cattleHeads == 5) {
      this.cattleHeadsLine1 = "🐮🐮🐮";
      this.cattleHeadsLine2 = "🐮🐮";
    } else if (cattleHeads == 7) {
      this.cattleHeadsLine1 = "🐮🐮🐮🐮";
      this.cattleHeadsLine2 = "🐮🐮🐮";
    } else {
      this.cattleHeadsLine1 = "🐮".repeat(cattleHeads);
    }
  }

}
