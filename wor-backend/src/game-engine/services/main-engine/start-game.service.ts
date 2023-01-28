import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Game, GameDocument, Player} from "../../schema/game.schema";
import {Model} from "mongoose";
import {NUMBER_OF_ADMISSIBLE_PLAYERS} from "../../config";

@Injectable()
export class StartGameService {

    private readonly NUMBER_OF_POTENTIAL_PLAYERS: number = NUMBER_OF_ADMISSIBLE_PLAYERS;

    private readonly logger: Logger = new Logger(StartGameService.name);

    constructor(@InjectModel(Game.name) public gameModel: Model<GameDocument>) {}

    /**
     * Étape 1 : nettoyer la base de donnée
     * Étape 2 : Créer un nouveau game en base de donnée
     */
    public async generateNewGame(): Promise<Game> {
        await this.__deleteOtherGames();
        return this.__createNewGame();
    }


    public async __createNewGame(): Promise<Game> {
        const game: Game = new Game();

        const players: Player[] = []
        for (let i = 0; i < this.NUMBER_OF_POTENTIAL_PLAYERS; i++) {
            const player: Player = new Player()
            players.push(player);
        }

        game.players = players;

        return this.gameModel.create(game);
    }


    public async __deleteOtherGames(): Promise<void> {
        await this.gameModel.deleteMany({});
    }


}
