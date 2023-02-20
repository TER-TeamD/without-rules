import { Component, Input } from '@angular/core';
import { Player } from '../model/player.model';
import { GameStatusEnum } from '../model/last-message.enum';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.css']
})
export class InfoBarComponent {

  @Input()
  public player: Player | null = null;
  @Input()
  public gameStatus = GameStatusEnum.BEGINING;
  @Input()
  public timer: number = 60;

  public GameStatusEnum: typeof GameStatusEnum = GameStatusEnum;
  public urlAvatar: string = "";
  public cattleHeads: number = 0;


  ngOnInit(): void {
    this.urlAvatar = `/assets/avatars/${this.player?.avatar}.png`;

    this.cattleHeads = 0;
    this.player?.in_player_game_property?.player_discard.forEach(card => this.cattleHeads += card.cattleHead);
  }
}
