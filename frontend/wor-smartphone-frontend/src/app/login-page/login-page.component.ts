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
    console.log(this.playerId);
    this.gameService.joinGame(this.playerId).subscribe(
      () => {
        console.log('Partie rejoint');
        this.router.navigate(['/cards/' + this.playerId]);

      },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );

  }

}
