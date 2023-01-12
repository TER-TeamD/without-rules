import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { WebsocketService } from "../services/websocket.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  public playerId: string = "";

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
  }

  public login() {
    if (this.playerId.length > 0) {
      this.gameService.joinGame(this.playerId);
      this.gameService.isConnected().subscribe(isConnected => {
        if (isConnected) {
          this.router.navigate(['/cards/' + this.playerId]);
        }
      });

    }
  }
}
