import { Card } from "./card.model";

export class GameCards {
    type: string;
    value: {
        id_player: string;
        cards: Card[];
    }

    constructor(type: string, value: { id_player: string; cards: Card[] }) {
        this.type = type;
        this.value = value;
    }
}