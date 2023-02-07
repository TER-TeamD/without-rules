import "./table.component.css"
import {Button, Grid, Paper, Stack} from "@mui/material";
import {TableService} from "./table.service";
import {useCallback, useEffect, useState} from "react";

export const TableComponentLogger = {
    log: (message) => console.log(`%c [TABLE_LOGGER] `, 'background: #222; color: #bada55', message),
    warn: (message) => console.warn(`%c [TABLE_LOGGER] `, 'background: #222; color: #bada55', message),
    error: (message) => console.error(`%c [TABLE_LOGGER] `, 'background: #222; color: #bada55', message),
}

export const TableComponent = () => {

    const [isTableConnected, setIsTableConnected] = useState(false);
    const [tableInitialization, setTableInitialization] = useState(null)
    const [playersConnected, setPlayersConnected] = useState([])
    const [, updateState] = useState();
    const [tableDecks, setTableDecks] = useState([])
    const [cardsPlayedByUser, setCardsPlayedByUser] = useState([])
    const [actions, setActions] = useState(null);

    useEffect(() => {
        TableService.connexionEstablished$.subscribe(isConnected => {
            setIsTableConnected(isConnected)
            TableComponentLogger.log(`Connected to server via socket : ${isConnected}`)
        });

        TableService.tableInitialization$.subscribe(tableInit => {
            setTableInitialization(tableInit)
            TableComponentLogger.log(`New table initialization :`)
            TableComponentLogger.log(tableInit)
        })

        TableService.playersConnected$.subscribe(p => {
            setPlayersConnected(p)
            TableComponentLogger.log(`New player connected to table : ${p.id_player}`)
            updateState({})
        })

        TableService.tableDecks$.subscribe(p => {
            TableComponentLogger.log("Table decks");
            TableComponentLogger.log(p);
            setTableDecks(p)
        })

        TableService.newCardPlayedByUser$.subscribe(newCard => {
            if (newCard !== null) {

                setCardsPlayedByUser(p => {
                    const r = p;
                    r.push(newCard)
                    return Array.from(new Set(r))
                })
                TableComponentLogger.log("Card played by user")
                TableComponentLogger.log(newCard)
            }
        })

        TableService.newActions$.subscribe(newAction => {
            if (newAction !== null) {
                setActions(newAction)
                TableComponentLogger.log("New actions")
                TableComponentLogger.log(newAction)
            }
        })

        TableService.endRoundInfos$.subscribe(infos => {
            if (infos != null) {
                setCardsPlayedByUser([])
                setTableDecks(infos.stacks)
                TableComponentLogger.log("End round infos")
            }
        })

    }, [])

    const createNewGame = async () => {
        await TableService.createNewGame()
    }

    const startGame = async () => {
        await TableService.startGame()
    }

    return <>
        <section className="MainTable" style={{border: "1px solid grey", borderRadius: "5px", padding: "10px"}}>
            <Button color="primary" variant="contained" onClick={createNewGame}>Create a new game</Button>

            {
                tableInitialization !== null
                    ? <div style={{marginTop: "10px", marginBottom: "10px"}}>

                        <div>
                            <h3>ID game :</h3>  {tableInitialization.id_game}
                        </div>

                        <div>
                            <h3>Potential players :</h3>
                            {playersConnected.map((p, i) => {
                                return <div
                                    key={i}
                                    style={{backgroundColor: p.is_connected ? "#9cd98b" : "#d98b8b"}}>
                                    {p.id_player}
                                </div>
                            })}
                        </div>

                    </div>
                    : <div>Any game was created</div>
            }

            <Button color="primary" variant="contained" onClick={startGame}>Start game</Button>

        </section>


        <section style={{border: "1px solid grey", borderRadius: "5px", padding: "10px", marginTop: "20px"}}>
            <h2>Cards played by user</h2>

            <Grid container>
            {
                cardsPlayedByUser.map((cardPlayed, i) => {
                        return <Grid item xs={4} sm={2} key={i} style={{border: "2px solid black", borderRadius: "5px", padding: "5px", margin: "5px"}}>
                            <p>Player : {cardPlayed.player_id}</p>
                            <p>Card : {cardPlayed.played_cards.value}</p>
                        </Grid>
                })
            }
            </Grid>

            <h2>Decks</h2>

            <Stack spacing={2}>

                {
                    tableDecks !== null
                        ? tableDecks.map((d, i) => {
                            return <div key={i}>
                                <Grid container>
                                    <Grid item xs={4} sm={2} key={i} style={{border: "2px solid black", borderRadius: "5px", padding: "5px", margin: "5px"}}>
                                        <p>Card : {d.stackHead.value}</p>
                                        <p>CattleHeads : {d.stackHead.cattleHead}</p>
                                    </Grid>

                                    {
                                        d.stackCards.map((stackCard, idx) => {
                                            return <Grid item xs={4} sm={2} key={idx} style={{border: "1px solid grey", borderRadius: "5px", padding: "5px", margin: "5px"}}>
                                                <p>Card : {stackCard.value}</p>
                                                <p>CattleHeads : {stackCard.cattleHead}</p>
                                            </Grid>
                                        })
                                    }
                                </Grid>
                            </div>
                        })
                        : <div>Any decks now</div>
                }


            </Stack>



        </section>
    </>


}
