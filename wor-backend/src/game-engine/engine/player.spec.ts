import {Player} from "./player";

describe("Player test", () => {
    test("Test method equal", () => {

        const player1 = new Player("William");
        const player2 = new Player("Mathilde");


        expect<boolean>(player1.equals(player1)).toBe(true)
        expect<boolean>(player1.equals(player2)).toBe(false)
    })
})
