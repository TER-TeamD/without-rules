import {useEffect} from "react";
import { io } from 'socket.io-client';


export const TableComponent = () => {

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

    useEffect(() => {
        connectSocket();

        socket.on('CREATE_NEW_GAME', (message) => {
            console.log("CREATE_NEW_GAME", message)

            message.game.players.forEach(p => console.log(p.id))
        });

        socket.on('TABLE_PLAYER_JOIN', (message) => {
            console.log("TABLE_PLAYER_JOIN", message)
        })

        socket.on('START_GAME', (message) => {
            console.log("START_GAME", message)
        })

        socket.on('NEW_PLAYER_PLAYED_CARD', (message) => {
            console.log("NEW_PLAYER_PLAYED_CARD", message)
        })

        socket.on('FLIP_CARD_ORDER', (message) => {
            console.log("FLIP_CARD_ORDER", message)
        })

        socket.on('NEW_RESULT_ACTION', (message) => {
            console.log("NEW_RESULT_ACTION", message)
        })

        socket.on('NEW_ROUND', (message) => {
            console.log("NEW_ROUND", message)
        })

        socket.on('END_GAME_RESULTS', (message) => {
            console.log("END_GAME_RESULTS", message)
        })
    }, [])


    const tableNewGame = () => {
        socket.emit('TABLE_NEW_GAME', {})
    }

    const startGame = () => {
        socket.emit('TABLE_START_GAME', {})
    }

    const tableAllPlayerPlayed = () => {
        socket.emit('TABLE_ALL_PLAYER_PLAYED', {})
    }

    const tableNextRoundResultAction = () => {
        socket.emit('TABLE_NEXT_ROUND_RESULT_ACTION', {})
    }

    return <>
        <button onClick={tableNewGame}>TABLE_NEW_GAME</button>
        <button onClick={startGame}>TABLE_START_GAME</button>
        <button onClick={tableAllPlayerPlayed}>TABLE_ALL_PLAYER_PLAYED</button>
        <button onClick={tableNextRoundResultAction}>TABLE_NEXT_ROUND_RESULT_ACTION</button>
    </>
}
