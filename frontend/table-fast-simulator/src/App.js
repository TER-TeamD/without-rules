import logo from './logo.svg';
import './App.css';
import {SocketService} from "./services/socket.service";
import {TableComponent} from "./components/table-component/table.component";
import {Button, Divider, Grid, Paper, Stack} from "@mui/material";
import {OnePlayerComponent} from "./components/players/one-player-component/one-player.component";
import {useState} from "react";
import Grid2 from '@mui/material/Unstable_Grid2';

function App() {

  const [players, setPlayers] = useState(Array.from([]))

  const addPlayer = () => {
    const arr = Array.from(players)
    arr.push(10)
    setPlayers(arr)
  }

  return (<>
    <Paper style={{margin: "10px", padding: "10px"}} elevation={5}>
      <TableComponent></TableComponent>
    </Paper>

    <Paper elevation={5} style={{margin: "10px", padding: "10px"}}>
      <Stack spacing={2} style={{margin: "10px", boxSizing: "border-box"}}>

        {Array.from(players).map((p, i) => {return <div key={i}><OnePlayerComponent></OnePlayerComponent></div>  })}

        <Button onClick={addPlayer}>Add one</Button>


      </Stack>
    </Paper>






  </>);
}

export default App;
