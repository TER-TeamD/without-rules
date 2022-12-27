import logo from './logo.svg';
import './App.css';
import {SocketService} from "./services/socket.service";

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
    </div>
  );
}

export default App;
