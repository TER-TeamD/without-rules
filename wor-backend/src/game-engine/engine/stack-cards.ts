import {Card} from "./card";


export class StackCards {

    private _currentStackHead: Card;
    private _currentStack: Card[] = [];


    constructor(currentStackHead: Card) {
        this._currentStackHead = currentStackHead;
        this._currentStack.push(this.currentStackHead)
    }

    /**
     *
     * @param card : card you want to add
     * @return list of cards you need to add to the player stack
     */
    public pushCard(card: Card): Card[] {
        this._currentStack.push(this._currentStackHead);
        this._currentStackHead = card;

        // Check if stack is finished
        if (this._currentStack.length === 6) {
            this._currentStackHead = this._currentStack.pop();
            const result: Card[] = this._currentStack;
            this._currentStack = [this._currentStackHead];
            return result
        }

        return [];
    }

    public verifyIfStackFinished() {

    }

    get currentStackHead(): Card {
        return this._currentStackHead;
    }

    get currentStack(): Card[] {
        return this._currentStack;
    }
}
