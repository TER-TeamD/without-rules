import {RuntimeException} from "@nestjs/core/errors/exceptions";


export class StackNotFoundException extends RuntimeException {

    constructor(stackNumber: number) {
        super(`Any stack found with the number ${stackNumber}`);
    }
}


