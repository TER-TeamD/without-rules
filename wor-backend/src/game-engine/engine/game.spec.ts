import {Game} from "./game";
import {Player} from "./player";


describe("Deck initialization ", () => {
    test("", () => {

        const player1 = new Player("William");
        const player2 = new Player("Mathilde");

        const players: Player[] = [player1, player2]
        const game: Game = new Game(players);

        expect<number>(game.deckCards.length).toEqual(104 - 10 - 10 - 5)
        expect<number>(player1.cards.length).toEqual(10)
        expect<number>(player1.cards.length).toEqual(10)
        expect<number>(game.stackCards1.currentStack.length).toEqual(1);
        expect<number>(game.stackCards2.currentStack.length).toEqual(1);
        expect<number>(game.stackCards3.currentStack.length).toEqual(1);
        expect<number>(game.stackCards4.currentStack.length).toEqual(1);
        expect<number>(game.stackCards5.currentStack.length).toEqual(1);

        // Players choose the slowest card
        // player1.cardChoose = player1.cards.



    })
})
