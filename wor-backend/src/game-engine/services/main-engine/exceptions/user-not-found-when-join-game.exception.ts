import {RuntimeException} from "@nestjs/core/errors/exceptions";


export class UserNotFoundWhenJoinGameException extends RuntimeException {

    constructor(idPlayer: string) {
        super(`Any user found with the ID ${idPlayer}`);
    }
}


