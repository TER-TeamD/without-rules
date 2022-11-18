import {Logger, NotAcceptableException} from "@nestjs/common";
import {Card} from "./card";
import {ExceptionsHandler} from "@nestjs/core/exceptions/exceptions-handler";


export class Player {
    private readonly _name: string;
    private _cards: Card[];
    private _cardChoose: Card | null = null;
    private _resultStack: Card[] = [];
    private _numberOfCattleHeads: number = 0;


    constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }


    get cardChoose(): Card | null {
        return this._cardChoose;
    }

    set cardChoose(card: Card) {
        const indexCardInCards = this._cards.findIndex(c => c.number === card.number);

        if (indexCardInCards < 0) {
            throw new NotAcceptableException(`PLAYER_DOESNT_OWN_CARD`, `The player doesn't have the card ${card.toString()} in his cards stack`);
        }

        this._cards.splice(indexCardInCards, 1);
        this._cardChoose = card;
    }

    set cards(value: Card[]) {
        this._cards = value;
    }

    get cards(): Card[] {
        return this._cards;
    }

    public equals(player: Player): boolean {
        return player.name === this.name
    }

    public addCardToResultStack(cards: Card[]): void {
        this._resultStack.push(...cards);
        this._numberOfCattleHeads = this._resultStack.map<number>(c => c.cattleHead).reduce((partialSum, c) => partialSum + c)
    }


    get numberOfCattleHeads(): number {
        return this._numberOfCattleHeads;
    }
}
