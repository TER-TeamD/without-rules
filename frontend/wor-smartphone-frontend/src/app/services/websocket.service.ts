import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { GameCards } from '../model/gamecards';
import {Socket} from "socket.io-client/build/esm/socket";
import {AuthService} from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: Socket | null = null;

  constructor(private authService: AuthService) {}


  tst() {
    console.log("on est la ")
  }

  connect(playerId: string): Subject<GameCards> {

    let observable = new Observable(observer => {
      // @ts-ignore
      this.socket.on('player', (data: any) => {
        if (data.value.id_player === playerId) {
          console.log("Received message from Websocket Server")
          observer.next(data);
        }
      })
      return () => {
        // @ts-ignore
        this.socket.disconnect();
      }
    })

    let observer = {
      next: (data: Object) => {
        // @ts-ignore
        this.socket.emit('player', JSON.stringify(data));
      }
    }
    return Subject.create(observer, observable);
  }


  public connectToSocket(): void {
    if (this.authService.idPlayer == null) {
      throw new Error("Cannot connect to the websocket without the playerID")
    } else {
      this.socket = io('http://localhost:8451', {
        auth: {
          type: 'PLAYER',
          id: this.authService.idPlayer
        }
      });
      this.socket.connect();
    }
  }
}
