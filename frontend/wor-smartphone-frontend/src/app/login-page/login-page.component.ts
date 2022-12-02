import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';

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
      this.gameService.joinGame(this.playerId).subscribe(
        () => {
          this.router.navigate(['/cards/' + this.playerId]);
        },
        (err) => {
          alert("This player ID doesn't exist");
        }
      );
    }
  }

}
