import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from '../services/game.service';
import {Router} from '@angular/router';
import {LastMessageEnum} from "../model/last-message.enum";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy{

  public playerId: string = "";
  private lastMessageSubscription: Subscription | null = null;

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
   this.lastMessageSubscription = this.gameService.lastMessage$.subscribe(lastMessage => {
     if (lastMessage === LastMessageEnum.PLAYER_LOGGED_IN_GAME) {
       console.log("Player joined game")
     }
   })
  }

  public async login() {
    if (this.playerId.length > 0) {
      await this.gameService.joinGame(this.playerId);
    }
  }

  ngOnDestroy(): void {
    this.lastMessageSubscription?.unsubscribe();
  }
}
