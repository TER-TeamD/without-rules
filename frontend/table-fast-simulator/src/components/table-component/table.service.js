import {io} from "socket.io-client";
import {BehaviorSubject, Observable} from 'rxjs';



let isConnected = false
const socket = io('http://localhost:8451', {
    autoConnect: false,
    auth: {
        id: "0",
        type: "TABLE",
    }
})



const createNewGame = async () => {
    if (!isConnected) {
        await connectToSocket()
    }

    console.log("Table create a new game")
    await emitMessage('table_create_game', {});
}

const startGame = async () => {
    await emitMessage('table_start_game', {});
}


const idGame = new BehaviorSubject("")
const connexionEstablished$ = new BehaviorSubject(false)
const tableInitialization$ = new BehaviorSubject(null)
const playersConnected$ = new BehaviorSubject([])
const tableDecks$ = new BehaviorSubject(null)
const newCardPlayedByUser$ = new BehaviorSubject(null)
const newActions$ = new BehaviorSubject(null);
const endRoundInfos$ = new BehaviorSubject(null);


socket.on('connection_status_server', (message) => {
    connexionEstablished$.next(true);
});

socket.on('disconnect', (message) => {
    connexionEstablished$.next(false);
});

socket.on('player_initialization', (message) => {
    tableInitialization$.next(message)
    playersConnected$.next(message.potential_players_id.map(p => {
        return {is_connected: false, id_player: p}
    }))
})

socket.on('table_cards_initialization', (message) => {
    tableDecks$.next(message.stack_cards)
})


socket.on('new_player_connexion', (message) => {
    const current = playersConnected$.value
    const currentIndex = current.findIndex(c => c.id_player === message.player_id)
    if (currentIndex >= 0) {
        current[currentIndex].is_connected = true
        playersConnected$.next(current)
    }
})

socket.on('CARD_PLAYED_BY_USER', (message) => {
    newCardPlayedByUser$.next(message);
})



socket.on('NEW_ACTIONS', (message) => {
    newActions$.next(message)
})

socket.on('END_ROUND_DETAILS', (message) => {
    endRoundInfos$.next(message)
})






const emitMessage = async (topic, value) => {
    await socket.emit(topic, value)
}

const connectToSocket = async () => {
    try {
        await socket.disconnect().connect();
        isConnected = true
        console.log("Connected to table socket")
    } catch (e) {
        console.error("Cannot connect to the table socket")
        console.error(e)
    }
}


export const TableService = {
    createNewGame,
    startGame,
    connexionEstablished$,
    tableInitialization$,
    playersConnected$,
    tableDecks$,
    newCardPlayedByUser$,
    newActions$,
    endRoundInfos$
}
