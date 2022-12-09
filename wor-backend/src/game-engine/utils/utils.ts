import {Player, Result, StackCard} from "../schema/game.schema";


export function shuffle(array: any[]): any[] {
    array = array.sort(() => Math.random() - 0.5);
    array = array.sort(() => Math.random() - 0.5);
    return array
}

export function sortPlayerByCardsIncreasingOrder(array: Player[]): Player[] {
    return array.sort((p1, p2) => {
        return (p1.in_player_game_property.played_card.value > p2.in_player_game_property.played_card.value) ? 1 : ((p1.in_player_game_property.played_card.value < p2.in_player_game_property.played_card.value) ? -1 : 0)
    })
}

export function sortStackCardsByHeadCardsIncreasingOrder(array: StackCard[]): StackCard[] {
    return array.sort((p1, p2) => {
        return (p1.stackHead.value > p2.stackHead.value) ? 1 : ((p1.stackHead.value < p2.stackHead.value) ? -1 : 0)
    })
}

export function sortResultByCattleHead(array: Result[]): Result[] {
    return array.sort((r1, r2) => {
        return (r1.cattle_heads > r2.cattle_heads) ? 1 : ((r1.cattle_heads < r2.cattle_heads) ? -1 : 0)
    })
}
