import {RuntimeException} from "@nestjs/core/errors/exceptions";


export class RoundIsNotFinishedException extends RuntimeException {

    constructor() {
        super(`Round is not finished`);
    }
}


