import {RuntimeException} from "@nestjs/core/errors/exceptions";


export class NotEnoughPlayersForStartingGameException extends RuntimeException {

    constructor() {
        super(`For starting a game, the minimal number of players is 2`);
    }
}
