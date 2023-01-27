import {useEffect, useState} from "react";
import {Button, Paper, TextField} from "@mui/material";
import {OnePlayerService} from "./one-player.service";


export const OnePlayerComponent = () => {

    const [isLogged, setIsLogged] = useState(false)
    const [idUser, setIdUser] = useState("")
    const [socket, setSocket] = useState(null)

    if (socket != null) {
        socket.on('new_player_connexion', (message) => {
            console.log(`PLAYER ${idUser} - new_player_connexion :`, message)
        })
    }


    const onConnect = async () => {
        await OnePlayerService.addNewPlayer(idUser)
        setSocket(OnePlayerService.getPlayerSocket(idUser))
    }

    const htmlIfNotLogged = <div>
        <TextField id="outlined-basic" label="id player" variant="outlined" onChange={(e) => setIdUser(e.target.value)} />
        <Button variant="contained" onClick={onConnect}>Se connecter</Button>
    </div>

    const htmlIfLogged = <div>Logged</div>

    return <Paper elevation={2} style={{padding: '20px', paddingTop: '5px'}}>
        <h2>Player</h2>
        {
            isLogged ? htmlIfLogged : htmlIfNotLogged
        }
    </Paper>
}
