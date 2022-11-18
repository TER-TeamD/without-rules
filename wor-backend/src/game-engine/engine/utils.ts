import {Card} from "./card";
import {Player} from "./player";


export function shuffle(array: any[]): any[] {
    array = array.sort(() => Math.random() - 0.5);
    array = array.sort(() => Math.random() - 0.5);
    return array
}

export function sortCardsIncreasingOrder(array: Card[]): Card[] {
    return array.sort((c1, c2) => {
        return (c1.number > c2.number) ? 1 : ((c1.number < c2.number) ? -1 : 0)
    })
}

export function sortCardsDecreasingOrder(array: Card[]): Card[] {
    return array.sort((c1, c2) => {
        return (c1.number > c2.number) ? -1 : ((c1.number < c2.number) ? 1 : 0)
    })
}

export function sortPlayerByCardsIncreasingOrder(array: Player[]): Player[] {
    return array.sort((p1, p2) => {
        return (p1.cardChoose.number > p2.cardChoose.number) ? 1 : ((p1.cardChoose.number < p2.cardChoose.number) ? -1 : 0)
    })
}

export function sortPlayerByCardsDecreasingOrder(array: Player[]): Player[] {
    return array.sort((p1, p2) => {
        return (p1.cardChoose.number > p2.cardChoose.number) ? -1 : ((p1.cardChoose.number < p2.cardChoose.number) ? 1 : 0)
    })
}

export function sortPlayerByCattleHeadsIncreasingOrder(array: Player[]): Player[] {
    return array.sort((p1, p2) => {
        return (p1.numberOfCattleHeads > p2.numberOfCattleHeads) ? 1 : ((p1.numberOfCattleHeads < p2.numberOfCattleHeads) ? -1 : 0)
    })
}
