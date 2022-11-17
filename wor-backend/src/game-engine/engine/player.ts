import {Logger} from "@nestjs/common";
import {Card} from "./card";


export class Player {
    private readonly _name: string;
    private _cards: Card[];


    constructor(name: string) {
        this._name = name;
    }


    get name(): string {
        return this._name;
    }


    set cards(value: Card[]) {
        this._cards = value;
    }

    get cards(): Card[] {
        return this._cards;
    }
}
