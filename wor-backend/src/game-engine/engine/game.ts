import {Card} from "./card";
import {rootLogger} from "ts-jest";
import {HttpException, HttpStatus, Logger, NotAcceptableException} from "@nestjs/common";
import {TestingLogger} from "@nestjs/testing/services/testing-logger.service";
import {
    shuffle,
    sortPlayerByCardsDecreasingOrder,
    sortPlayerByCardsIncreasingOrder,
    sortPlayerByCattleHeadsIncreasingOrder
} from "./utils";
import {Player} from "./player";
import {StackCards} from "./stack-cards";


export class Game {
    private readonly logger = new Logger("GAME")
    private _deckCards: Card[] = [];
    private readonly _players: Player[];

    private _stackCards1: StackCards;
    private _stackCards2: StackCards;
    private _stackCards3: StackCards;
    private _stackCards4: StackCards;
    private _stackCards5: StackCards;

    private currentRound: number = 10; // round in decreasing order

    constructor(players: Player[]) {
        this._players = players;

        if (this._players.length < 2 || this._players.length > 10) {
            throw new HttpException("Please provide a good number of users", HttpStatus.UNPROCESSABLE_ENTITY)
        }

        this._deckCardInitializer()
        this._deckCards = shuffle(this._deckCards)

        this._players.forEach(player => {
            player.cards = this._deckCards.slice(0, 10);
            this._deckCards = this._deckCards.slice(10);
        })

        this._stackCards1 = new StackCards(this._deckCards.pop())
        this._stackCards2 = new StackCards(this._deckCards.pop())
        this._stackCards3 = new StackCards(this._deckCards.pop())
        this._stackCards4 = new StackCards(this._deckCards.pop())
        this._stackCards5 = new StackCards(this._deckCards.pop())
    }



    public nextRound(): void {

        if (this.currentRound === 0) {
            throw new NotAcceptableException(`GAME_FINISHED`, `The game is finished, please launch a new party`);
        }

        this._players.forEach(p => {
            if (p.cards.length != this.currentRound - 1 || p.cardChoose === null) {
                throw new NotAcceptableException(`PLAYER_DIDNT_CHOOSE_CARD`, `The player ${p.name} didn't choose a card, please provide the card`);
            }
        });

        this.currentRound -= 1;

        const orderedPlayers: Player[] = sortPlayerByCardsIncreasingOrder(this._players)

        for (const p in orderedPlayers) {
            // @ts-ignore
            const player: Player = p;
            const playedCard: Card = player.cardChoose;

            const differenceWithStackCard1: number = playedCard.number - this._stackCards1.currentStackHead.number;
            const differenceWithStackCard2: number = playedCard.number - this._stackCards2.currentStackHead.number;
            const differenceWithStackCard3: number = playedCard.number - this._stackCards3.currentStackHead.number;
            const differenceWithStackCard4: number = playedCard.number - this._stackCards4.currentStackHead.number;
            const differenceWithStackCard5: number = playedCard.number - this._stackCards5.currentStackHead.number;

            if (differenceWithStackCard1 > 0
                && differenceWithStackCard1 <= differenceWithStackCard2
                && differenceWithStackCard1 <= differenceWithStackCard3
                && differenceWithStackCard1 <= differenceWithStackCard4
                && differenceWithStackCard1 <= differenceWithStackCard5
            ) {
                // Empiler sur stackCard1
                const cardsToAddToUser: Card[] = this._stackCards1.pushCard(playedCard)
                player.addCardToResultStack(cardsToAddToUser);

            } else if (differenceWithStackCard2 > 0
                && differenceWithStackCard2 <= differenceWithStackCard1
                && differenceWithStackCard2 <= differenceWithStackCard3
                && differenceWithStackCard2 <= differenceWithStackCard4
                && differenceWithStackCard2 <= differenceWithStackCard5
            ) {
                // Empiler sur stackCard2
                const cardsToAddToUser: Card[] = this._stackCards2.pushCard(playedCard)
                player.addCardToResultStack(cardsToAddToUser);
            } else if (differenceWithStackCard3 > 0
                && differenceWithStackCard3 <= differenceWithStackCard1
                && differenceWithStackCard3 <= differenceWithStackCard2
                && differenceWithStackCard3 <= differenceWithStackCard4
                && differenceWithStackCard3 <= differenceWithStackCard5
            ) {
                // Empiler sur stackCard3
                const cardsToAddToUser: Card[] = this._stackCards3.pushCard(playedCard)
                player.addCardToResultStack(cardsToAddToUser);
            } else if (differenceWithStackCard4 > 0
                && differenceWithStackCard4 <= differenceWithStackCard1
                && differenceWithStackCard4 <= differenceWithStackCard2
                && differenceWithStackCard4 <= differenceWithStackCard3
                && differenceWithStackCard4 <= differenceWithStackCard5
            ) {
                // Empiler sur stackCard4
                const cardsToAddToUser: Card[] = this._stackCards4.pushCard(playedCard)
                player.addCardToResultStack(cardsToAddToUser);
            } else if (differenceWithStackCard5 > 0
                && differenceWithStackCard5 <= differenceWithStackCard1
                && differenceWithStackCard5 <= differenceWithStackCard2
                && differenceWithStackCard5 <= differenceWithStackCard3
                && differenceWithStackCard5 <= differenceWithStackCard4
            ) {
                // Empiler sur stackCard5
                const cardsToAddToUser: Card[] = this._stackCards5.pushCard(playedCard)
                player.addCardToResultStack(cardsToAddToUser);
            }
        }

        this.logger.log(orderedPlayers)
    }

    public getWinner(): Player {
        return sortPlayerByCattleHeadsIncreasingOrder(this._players)[0];
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

    get stackCards1(): StackCards {
        return this._stackCards1;
    }

    get stackCards2(): StackCards {
        return this._stackCards2;
    }

    get stackCards3(): StackCards {
        return this._stackCards3;
    }

    get stackCards4(): StackCards {
        return this._stackCards4;
    }

    get stackCards5(): StackCards {
        return this._stackCards5;
    }
}
