import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { GameCards } from '../model/gamecards';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: any;

  connect(playerId: string): Subject<GameCards> {
    this.socket = io('http://localhost:8451');

    let observable = new Observable(observer => {
      this.socket.on('player', (data: any) => {
        if (data.value.id_player === playerId) {
          console.log("Received message from Websocket Server")
          observer.next(data);
        }
      })
      return () => {
        this.socket.disconnect();
      }
    })

    let observer = {
      next: (data: Object) => {
        this.socket.emit('player', JSON.stringify(data));
      }
    }

    return Subject.create(observer, observable);
  }
}
