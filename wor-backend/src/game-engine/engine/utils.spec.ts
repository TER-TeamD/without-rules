import {Card} from "./card";
import {sortCardsIncreasingOrder} from "./utils";


describe("Utils test", () => {
    test("Sort cards", () => {

        const cards: Card[] = [
            new Card(1, 0),
            new Card(10, 0),
            new Card(5, 0),
            new Card(2, 0),
            new Card(30, 0),
            new Card(8, 0),
        ];

        const result = sortCardsIncreasingOrder(cards);

        expect<number>(result[0].number).toEqual(1)
        expect<number>(result[1].number).toEqual(2)
        expect<number>(result[2].number).toEqual(5)
        expect<number>(result[3].number).toEqual(8)
        expect<number>(result[4].number).toEqual(10)
        expect<number>(result[5].number).toEqual(30)
    });
})
