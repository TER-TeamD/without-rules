import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {BetweenRound, Card, Game, GameDocument, Player, PlayerFlipOrder} from "../../schema/game.schema";
import {Model} from "mongoose";
import {EngineUtilsService} from "./engine-utils.service";
import {GameNotFoundException} from "./exceptions/game-not-found.exception";

@Injectable()
export class RoundResultService {

    private readonly logger: Logger = new Logger(RoundResultService.name);

    constructor(@InjectModel(Game.name) public gameModel: Model<GameDocument>) {}


    /**
     * Generate the game.InGameProperty.between_round values
     * @exception GameNotFoundException()
     */
    public async flipCardOrder(): Promise<Game> {
        const currentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);
        if (currentGame === null) throw new GameNotFoundException();
        currentGame.in_game_property.between_round = new BetweenRound();

        const playersAndPlayedCard: {player: Player, card: Card}[] = currentGame.players.map(p => {
            return {player: p, card: p.in_player_game_property.played_card}
        });

        playersAndPlayedCard.sort((a, b) => {
            return a.card.value - b.card.value;
        });

        playersAndPlayedCard.forEach((p, index) => {
            currentGame.in_game_property.between_round.playerOrder.push(new PlayerFlipOrder(p.player, index))
        })

        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: "after"});
    }


    /**
     * Quand on fait l'analyse du round, il y a plusieurs actions possibles. Ces actions
     * sont générées grâce à cette méthode, il est donc nécessaire de la lancer jusqu'à ce que
     * la dernière action NextRoundPlayerAction (situé au niveau de game.between_round.current_player_action.
     * @exception GameNotFoundException()
     */
    public async generateNextAction(): Promise<Game> {
        const currentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);
        if (currentGame === null) throw new GameNotFoundException();

        /**
         * Règles du jeu :
         * 1) The number of the card that is added to a row must be higher than the number of the current last
         *    card in that row
         *
         * 2) A card must always be added to the row with the smallest possible difference between the current
         *    last card and the new one.
         *
         * 3) A row with 5 cards in it is full. If Rule No. 2 would put a sixth card in such a row, the player
         *    who played that card must take all five cards of the full row. His card then becomes the first
         *    in the new row.
         *
         * 4) If a player plays a card whose number is so low that it does not fit into any row, he must pick
         *    up all cards of a row of his choice. His card then becomes the first card of the new row.
         */

        const minimumVariation: {deck_number: number, delta: number} = {deck_number: null, delta: 0}
        currentGame.in_game_property.stacks.forEach(stack => {

        })




        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: "after"});
    }




}
