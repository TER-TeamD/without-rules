import { io } from 'socket.io-client';
import { addMessage } from './messages.service';


const socket = io('http://localhost:8451', {
    autoConnect: false,
    auth: {
        id: "0",
        type: "TABLE",
    }
});

const connectSocket = () => {
    socket.disconnect().connect();
}

const createNewGame = async () => {
    await socket.emit('table_create_game', {});
};

const startGame = () => {
    socket.emit('table_start_game', {});
}

socket.on('connection_status_server', (message) => {
    console.log('connection_status_server', message);
});

socket.on('player_initialization', (message) => {
    console.log('player_initialization', message)
});

socket.on('table_cards_initialization', (message) => {
    console.log('table_cards_initialization', message)
});

socket.on('table_new_player', (message) => {
    console.log("table_new_player", message)
})

socket.onAny((...args) => {
    console.log("Socket message received", args)
    addMessage({title: "Socket message received", message: args});
})

export const SocketService = {
    socket,
    createNewGame,
    startGame,
    connectSocket,
}
