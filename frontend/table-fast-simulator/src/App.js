import logo from './logo.svg';
import './App.css';
import {SocketService} from "./services/socket.service";

function App() {

  const launchGame = async () => {
    await SocketService.createNewGame();
  }

  return (
    <div className="App">
      <button onClick={launchGame}>Launch Game</button>
    </div>
  );
}

export default App;
