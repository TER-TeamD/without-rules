import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Card, Game, GameDocument, Player} from "../../schema/game.schema";
import {Model} from "mongoose";
import {EngineUtilsService} from "./engine-utils.service";
import {PlayerNotFoundException} from "./exceptions/player-not-found.exception";
import {PlayerAlreadyPlayedCardException} from "./exceptions/player-already-played-card.exception";
import {PlayerDontHaveCardException} from "./exceptions/player-dont-have-card.exception";
import {GameNotFoundException} from "./exceptions/game-not-found.exception";
import {RoundIsNotFinishedException} from "./exceptions/round-is-not-finished.exception";

@Injectable()
export class DuringRoundService {

    private readonly logger: Logger = new Logger(DuringRoundService.name);

    constructor(@InjectModel(Game.name) public gameModel: Model<GameDocument>) {}

    /**
     * @exception GameNotFoundException()
     */
    public async isRoundFinished(): Promise<boolean> {
        const currentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);
        if (currentGame === null) throw new GameNotFoundException();

        const playersWhoDidntPlayCard: Player[] = currentGame.players.filter(p => p.in_player_game_property.had_played_turn === false)

        return playersWhoDidntPlayCard.length === 0;
    }

    /**
     * When a round is totally finished, we go to the next one
     * - verify that round is finished,
     * - Increase the round number
     * - Remove the played card from cards[] for each player
     * - Add the removed card to played_cards[] for each player
     * - Reinitialize in_player_game_property for each player
     *
     * @exception GameNotFoundException()
     * @exception RoundIsNotFinishedException()
     */
    public async nextRound(): Promise<Game> {
        const currentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);
        if (currentGame === null) throw new GameNotFoundException();

        if ((await this.isRoundFinished()) === false) throw new RoundIsNotFinishedException();

        currentGame.in_game_property.current_round += 1;
        currentGame.in_game_property.between_round = null;
        currentGame.players.forEach(p => {
            p.cards = p.cards.filter(c => c.value !== p.in_player_game_property.played_card.value)
            p.played_cards.push(p.in_player_game_property.played_card)

            p.in_player_game_property.had_played_turn = false;
            p.in_player_game_property.played_card = null;
        });

        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: "after"});
    }

    /**
     *
     * @param playerId : id of the player
     * @param cardValue : value of the card played
     * @exception GameNotFoundException()
     * @exception PlayerNotFoundException() when the player is not found
     * @exception PlayerAlreadyPlayedCardException() when the player already played during this round
     * @exception PlayerDontHaveCardException()
     */
    public async newPlayerPlayed(playerId: string, cardValue: number): Promise<Game> {
        const currentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);
        if (currentGame === null) throw new GameNotFoundException();

        const indexPlayer: number = currentGame.players.findIndex(p => p.id === playerId);
        if (indexPlayer < 0) throw new PlayerNotFoundException(playerId);

        const player: Player = currentGame.players[indexPlayer];

        if (player.in_player_game_property.played_card !== null) throw new PlayerAlreadyPlayedCardException(playerId);
        if (player.in_player_game_property.had_played_turn === true) throw new PlayerAlreadyPlayedCardException(playerId);

        const indexCard: number = player.cards.findIndex(c => c.value === cardValue);
        if (indexCard < 0) throw new PlayerDontHaveCardException(playerId, cardValue);

        player.in_player_game_property.played_card = player.cards[indexCard];
        player.in_player_game_property.had_played_turn = true;

        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: "after"});
    }



}
