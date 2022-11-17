

export class Card {
    private readonly _number: number;
    private readonly _cattleHead: number;


    constructor(number: number, cattleHead: number) {
        this._number = number;
        this._cattleHead = cattleHead;
    }


    get number(): number {
        return this._number;
    }

    get cattleHead(): number {
        return this._cattleHead;
    }

    public toString(): string {
        return `Card ${this._number} : ${this._cattleHead}`
    }
}
