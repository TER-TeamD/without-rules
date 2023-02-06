import { Injectable } from '@nestjs/common';
import {Game, GameDocument, StackCard} from "../../schema/game.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class EngineUtilsService {


    static shuffle(array: any[]): any[] {
        array = array.sort(() => Math.random() - 0.5);
        array = array.sort(() => Math.random() - 0.5);
        return array
    }

    static async getCurrentGame(gameModel: Model<GameDocument>): Promise<Game | null> {

        const games: Game[] = await gameModel.find({});

        if (games == null || games.length === 0) {
            return null;
        }

        return games[0]
    }

    static async setCurrentGame(gameModel: Model<GameDocument>, game: Game): Promise<Game | null> {
        return gameModel.findOneAndUpdate({}, game, {returnDocument: "after"});
    }

    static async getStackCardById(gameModel: Model<GameDocument>, idStackCard: number): Promise<StackCard | null> {
        const games: Game[] = await gameModel.find({});

        if (games == null || games.length === 0) {
            return null;
        }

        const game: Game = games[0];
        const index: number = game.in_game_property.stacks.findIndex(s => s.stackNumber === idStackCard);
        if (index < 0) {
            return null;
        }

        return game.in_game_property.stacks[index]
    }
}
