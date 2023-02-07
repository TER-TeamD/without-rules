import {RuntimeException} from "@nestjs/core/errors/exceptions";


export class PlayerNotFoundException extends RuntimeException {

    constructor(idPlayer: string) {
        super(`Any user found with the ID ${idPlayer}`);
    }
}


