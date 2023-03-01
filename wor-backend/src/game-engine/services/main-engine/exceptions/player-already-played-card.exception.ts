import {RuntimeException} from "@nestjs/core/errors/exceptions";


export class PlayerAlreadyPlayedCardException extends RuntimeException {



    constructor(idPlayer: string) {
        super(`Player ${idPlayer} already played a card during this round`);
    }
}


