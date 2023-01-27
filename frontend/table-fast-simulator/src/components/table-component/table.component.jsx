import "./table.component.css"
import {Button} from "@mui/material";
import {TableService} from "./table.service";
import {useCallback, useEffect, useState} from "react";

export const TableComponentLogger = {
    log: (message) => console.log(`[TABLE_LOGGER] `, message),
    warn: (message) => console.warn(`[TABLE_LOGGER] `, message),
    error: (message) => console.error(`[TABLE_LOGGER] `, message),
}

export const TableComponent = () => {

    const [isTableConnected, setIsTableConnected] = useState(false);
    const [tableInitialization, setTableInitialization] = useState(null)
    const [playersConnected, setPlayersConnected] = useState([])
    const [, updateState] = useState();

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
            TableComponentLogger.log(`new player`)
            updateState({})
        })
    }, [])

    const createNewGame = async () => {
        await TableService.createNewGame()
    }

    return <>
        <section className="MainTable">
            <Button color="primary" variant="contained" onClick={createNewGame}>Create a new game</Button>

            {
                tableInitialization !== null
                    ? <div>

                        <div>
                            ID game : {tableInitialization.id_game}
                        </div>

                        <div>
                            Potential players :
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

        </section>
    </>


}
