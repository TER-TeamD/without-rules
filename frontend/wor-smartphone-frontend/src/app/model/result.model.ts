export class Result {
    id_player: string;
    cattle_heads: number;
    rank: number;

    constructor(id_player: string, cattle_heads: number, rank: number) {
        this.id_player = id_player;
        this.cattle_heads = cattle_heads;
        this.rank = rank;
    }
}