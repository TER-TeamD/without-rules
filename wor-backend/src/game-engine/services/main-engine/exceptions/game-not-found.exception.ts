import {RuntimeException} from "@nestjs/core/errors/exceptions";


export class GameNotFoundException extends RuntimeException {

    constructor() {
        super(`Game not found`);
    }
}
