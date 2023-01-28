import {RuntimeException} from "@nestjs/core/errors/exceptions";


export class PlayerDontHaveCardException extends RuntimeException {

    constructor(idPlayer: string, cardValue: number) {
        super(`Player ${idPlayer} doesn't have the card ${cardValue} in his deck`);
    }
}


