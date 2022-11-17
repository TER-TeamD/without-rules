import {Card} from "./card";
import {rootLogger} from "ts-jest";
import {HttpException, HttpStatus, Logger} from "@nestjs/common";
import {TestingLogger} from "@nestjs/testing/services/testing-logger.service";
import {shuffle} from "./utils";
import {Player} from "./player";


export class Game {
    private readonly logger = new Logger("GAME")
    private _deckCards: Card[] = [];
    private readonly _players: Player[];

    constructor(players: Player[]) {
        this._players = players;

        if (this._players.length < 2 || this._players.length > 10) {
            throw new HttpException("Please provide a good number of users", HttpStatus.UNPROCESSABLE_ENTITY)
        }

        this._players.forEach(player => {
            player.cards = this._deckCards.slice(0, 10);
            this._deckCards = this._deckCards.slice(10);
        })

        this._deckCardInitializer()
        this._deckCards = shuffle(this._deckCards)
        this.logger.log(this._deckCards)
    }








    private _deckCardInitializer(): any {
        const sevenCattleHeads: Array<number> = [55];
        const fiveCattleHeads:  Array<number> = [11, 22, 33, 44, 66, 77, 88, 99];
        const threeCattleHeads:  Array<number> = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const twoCattleHeads:  Array<number> = [5, 15, 25, 35, 45, 65, 75, 85, 95];
        const allSeveralCattleHeads: number[] = [...sevenCattleHeads, ...fiveCattleHeads, ...threeCattleHeads, ...twoCattleHeads]
        const oneCattleHeads:  Array<number> = Array.from({length: 104}, (_, i) => i + 1).filter(e => !allSeveralCattleHeads.includes(e))

        sevenCattleHeads.forEach(c => this._deckCards.push(new Card(c, 7)))
        fiveCattleHeads.forEach(c => this._deckCards.push(new Card(c, 5)))
        threeCattleHeads.forEach(c => this._deckCards.push(new Card(c, 3)))
        twoCattleHeads.forEach(c => this._deckCards.push(new Card(c, 2)))
        oneCattleHeads.forEach(c => this._deckCards.push(new Card(c, 1)))
    }


    get deckCards(): Card[] {
        return this._deckCards;
    }
}
