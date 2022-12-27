import { io } from 'socket.io-client';


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
    console.log(message);
});

socket.on('player_initialization', (message) => {
    console.log(message)
});

socket.on('table_cards_initialization', (message) => {
    console.log(message)
});

export const SocketService = {
    socket,
    createNewGame,
    startGame,
    connectSocket,
}
