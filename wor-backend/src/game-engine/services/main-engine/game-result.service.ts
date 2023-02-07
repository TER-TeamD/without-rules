import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Game, GameDocument} from "../../schema/game.schema";
import {Model} from "mongoose";
import {EngineUtilsService} from "./engine-utils.service";
import {GameNotFoundException} from "./exceptions/game-not-found.exception";

@Injectable()
export class GameResultService {

    constructor(@InjectModel(Game.name) public gameModel: Model<GameDocument>) {}

    public async getResults(): Promise<Game> {
        let currentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);
        if (currentGame === null) throw new GameNotFoundException();

        currentGame.players.forEach(p => {
            p.gameResult.cattleHeads = p.in_player_game_property.player_discard.map(item => item.cattleHead).reduce((prev, next) => prev + next)
        })

        currentGame.players.sort((a, b) => a.gameResult.cattleHeads - b.gameResult.cattleHeads);
        for (let i = 0; i < currentGame.players.length; i++) {
            currentGame.players[i].gameResult.ranking = i + 1;
        }

        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: "after"});
    }
}
