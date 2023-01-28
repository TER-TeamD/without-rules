import {useEffect, useState} from "react";
import {Button, Grid, Paper, Stack, TextField} from "@mui/material";
import {OnePlayerService} from "./one-player.service";

export const OnePlayerComponentLogger = {
    log: (message) => console.log('PLAYER', message)
}

export const OnePlayerComponent = () => {

    const [isLogged, setIsLogged] = useState(false)
    const [idUser, setIdUser] = useState("")
    const [socket, setSocket] = useState(null)
    const [cards, setCards] = useState(null)
    const [playedCard, setPlayedCard] = useState(0)
    const [discardValue, setDiscardValue] = useState(0)

    const [, updateState] = useState();

    useEffect(() => {
        if (socket != null) {
            socket.on('new_player_connexion', (message) => {
                console.log(`PLAYER ${idUser} - new_player_connexion :`, message)
                setIsLogged(true)
            });

            socket.on('player_cards_initialization', (message) => {
                console.log(`PLAYER ${idUser} - player_cards_initialization :`, message)
                setCards(message.cards)
            })

            socket.on('CARD_PLAYED_BY_USER', (message) => {
                console.log(`PLAYER ${idUser} - CARD_PLAYED_BY_USER :`, message)
                setPlayedCard(message.played_cards.value)
                updateState({})
            })

            socket.on('END_ROUND_DETAILS', (message) => {
                console.log(`PLAYER ${idUser} - END_ROUND_DETAILS :`, message)
                setPlayedCard(0)
                setCards(message.cards)
                setDiscardValue(message.discardValue)
                updateState({})
            })
        }
    })


    const onConnect = async () => {
        await OnePlayerService.addNewPlayer(idUser)
        setSocket(OnePlayerService.getPlayerSocket(idUser))
    }

    const playCard = async (cardValue) => {
        socket.emit('player_play_card', {
            player_id: idUser,
            body: {
                card_value: cardValue
            }
        })
    }


    const htmlWhenCards = <div>
        {
            cards !== null
                ?
                <Grid container style={{margin: "5px", boxSizing: "border-box"}}>
                    {
                        cards.map((c, i) => {
                            return <Grid item xs={4} sm={2} key={i} style={{border: "1px solid grey", borderRadius: "5px", padding: "5px", margin: "5px", backgroundColor: playedCard === c.value ? "#cbeab7": "#FFF"}}>
                                <p>Card : {c.value}</p>
                                <p>CattleHeads : {c.cattleHead}</p>
                                <Button variant="outlined" style={{width: "100%"}} onClick={() => playCard(c.value)}>Play card</Button>
                            </Grid>
                        })

                    }
                </Grid>
                : <div>No cards</div>
        }
    </div>

    const htmlIfNotLogged = <div>
        <TextField id="outlined-basic" label="id player" variant="outlined" onChange={(e) => setIdUser(e.target.value)} />
        <Button variant="contained" onClick={onConnect}>Se connecter</Button>
    </div>

    const htmlIfLogged = <div>{cards !== null ? htmlWhenCards : <div>waiting for other users</div>}</div>



    return <Paper elevation={2} style={{padding: '20px', paddingTop: '5px'}}>
        <h2>Player {idUser} | {discardValue}</h2>
        {
            isLogged ? htmlIfLogged : htmlIfNotLogged
        }
    </Paper>
}
