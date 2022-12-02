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

  public cattleHeads: string = "";

  constructor() { }

  ngOnInit(): void {
    this.cattleHeads = "🐮".repeat(this.card?.cattleHead || 0);
    console.log(this.cattleHeads);
  }

}
