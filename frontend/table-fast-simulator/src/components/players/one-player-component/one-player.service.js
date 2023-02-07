import {io} from "socket.io-client";


const sockets = []

const addNewPlayer = async (idPlayer) => {

    const socket =
    sockets.push({
        id: idPlayer,
        socket: io('http://localhost:8451', {
            autoConnect: false,
            auth: {
                id: idPlayer,
                type: "PLAYER",
            }
        })
    })

    await connectPlayer(idPlayer)
    await emitMessage('player_join_game', {player_id: idPlayer}, idPlayer)
}

const connectPlayer = async (playerId) => {
    const index = sockets.findIndex(s => s.id === playerId);
    if (index < 0) {
        console.error("Doesn't find player")
        return
    }

    await sockets[index].socket.disconnect().connect();
    console.log(`Player ${playerId} connected to server`)

}

const getPlayerSocket = (idPlayer) => {
    const index = sockets.findIndex(s => s.id === idPlayer);
    if (index < 0) {
        console.error("Doesn't find player")
        return
    }

    return sockets[index].socket
}

const emitMessage = async (topic, message, idPlayer) => {
    const index = sockets.findIndex(s => s.id === idPlayer);
    if (index < 0) {
        console.error("Doesn't find player")
        return
    }

    await sockets[index].socket.emit(topic, message)
}

export const OnePlayerService = {
    addNewPlayer,
    getPlayerSocket
}
