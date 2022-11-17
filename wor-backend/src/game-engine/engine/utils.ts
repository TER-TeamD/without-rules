


export function shuffle(array: any[]): any[] {
    array = array.sort(() => Math.random() - 0.5);
    array = array.sort(() => Math.random() - 0.5);
    return array
}
