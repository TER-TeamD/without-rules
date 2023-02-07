import {BehaviorSubject} from "rxjs";


/**
 * @type {{ title: string, message: * }[]}
 */
export const messages = []

/**
 * @type {BehaviorSubject<{title: string, message: *}[]>}
 */
export const messages$ = new BehaviorSubject(messages);

/**
 * @param {{ title: string, message: * }} message
 */
export const addMessage = (message) => {
    messages.push(message);
    messages$.next(messages);
}