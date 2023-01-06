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
        <div className="App container-sm py-5">
            <div className="d-flex mb-3">
                <button className="btn btn-primary me-3" onClick={launchGame}>Launch Session</button>
                <button className="btn btn-primary" onClick={startGame}>Start Game</button>
            </div>

            <MessageList/>
        </div>
    );
}

export default App;
