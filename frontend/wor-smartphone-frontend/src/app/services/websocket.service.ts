import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { GameCards } from '../model/gamecards';



@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: any;

  constructor() { }

  getCards(): Subject<GameCards> {
    this.socket = io('http://localhost:8451');

    let observable = new Observable(observer => {
      this.socket.on('player', (data: any) => {
        console.log("Received message from Websocket Server")
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    })

    return Subject.create(observable);
  }
}
