import './App.css';
import {SocketService} from "./services/socket.service";
import MessageList from "./components/message-list";

function App() {

    const launchGame = async () => {
        await SocketService.connectSocket();
        await SocketService.createNewGame();
    }

    const startGame = async () => {
        await SocketService.startGame();
    }

    return (
        <div className="App">
            <button onClick={launchGame}>Launch Session</button>
            <button onClick={startGame}>Start Game</button>

            <MessageList/>
        </div>
    );
}

export default App;
