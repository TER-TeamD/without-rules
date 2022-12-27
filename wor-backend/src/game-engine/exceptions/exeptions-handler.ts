import {HttpException, HttpStatus} from "@nestjs/common";


export class AnyGameFoundException extends HttpException {
    constructor() {
        super("Any game found", HttpStatus.UNPROCESSABLE_ENTITY);
    }
}

export class AnyPlayerFoundException extends HttpException {
    constructor(id: string) {
        super(`Any user found with the ID ${id}`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
