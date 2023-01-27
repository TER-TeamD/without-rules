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


const idGame = new BehaviorSubject("")
const connexionEstablished$ = new BehaviorSubject(false)
const tableInitialization$ = new BehaviorSubject(null)
const playersConnected$ = new BehaviorSubject([])


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


socket.on('new_player_connexion', (message) => {

    console.log("TABLE : new player connexion", message)

    const current = playersConnected$.value
    const currentIndex = current.findIndex(c => c.id_player === message.player_id)
    if (currentIndex >= 0) {
        current[currentIndex].is_connected = true
        playersConnected$.next(current)
    }
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
    connexionEstablished$,
    tableInitialization$,
    playersConnected$
}
