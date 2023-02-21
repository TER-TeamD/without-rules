import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LastMessageEnum } from '../model/last-message.enum';
import { Player } from '../model/player.model';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css']
})
export class LoadingPageComponent {
  public gameStatus: string = "LOADING";
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
    })
  }

  ngOnDestroy(): void {
    this.lastMessageSubscription?.unsubscribe();
    this.playerSubscription?.unsubscribe();
  }

}
