import { Injectable } from '@nestjs/common';
import {Game, GameDocument} from "../../schema/game.schema";
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
}
