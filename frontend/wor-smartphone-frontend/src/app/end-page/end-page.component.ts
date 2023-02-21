import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LastMessageEnum } from '../model/last-message.enum';
import { Player } from '../model/player.model';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-end-page',
  templateUrl: './end-page.component.html',
  styleUrls: ['./end-page.component.css']
})
export class EndPageComponent {
  public gameStatus: string = "END";
  private lastMessageSubscription: Subscription | null = null;
  private playerSubscription: Subscription | null = null;
  public player: Player | null = null;

  constructor(private gameService: GameService, private router: Router) {
  }

  ngOnInit(): void {

    this.lastMessageSubscription = this.gameService.lastMessage$.subscribe(async lastMessage => {

      if (lastMessage === LastMessageEnum.START_GAME) {
        console.log("Start game");
        await this.router.navigate(['/cards']);
      }
    });

    this.playerSubscription = this.gameService.player$.subscribe(async player => {
      console.log("New player value", player)
      this.player = player;
      if (this.player === null) {
        this.router.navigate(['/']);
      }
    })
  }

  ngOnDestroy(): void {
    this.lastMessageSubscription?.unsubscribe();
    this.playerSubscription?.unsubscribe();
  }

  public replay() {
    this.router.navigate(['/']);
  }

}
