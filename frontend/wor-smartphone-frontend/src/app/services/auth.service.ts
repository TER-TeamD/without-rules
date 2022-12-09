import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _idPlayer: string | null = null;
  private _idPlayer$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this._idPlayer);

  constructor() {}

  get idPlayer(): string | null {
    return this._idPlayer;
  }

  get idPlayer$(): BehaviorSubject<string | null> {
    return this._idPlayer$;
  }


  set idPlayer(value: string | null) {
    this._idPlayer = value;
    this._idPlayer$.next(value);
  }
}
