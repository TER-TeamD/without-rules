import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Card, Game, GameDocument, StackCard} from "../../schema/game.schema";
import {Model} from "mongoose";
import {GameNotFoundException} from "./exceptions/game-not-found.exception";
import {UserNotFoundWhenJoinGameException} from "./exceptions/user-not-found-when-join-game.exception";
import {NotEnoughPlayersForStartingGameException} from "./exceptions/not-enough-players-for-starting-game.exception";
import {EngineUtilsService} from "./engine-utils.service";
import {DURATION_PLAYER_CHOOSE_CARDS_IN_SECONDS, NUMBER_OF_CARDS_PER_PLAYER, NUMBER_OF_DECKS} from "../../config";

@Injectable()
export class InitializeGameService {

    private readonly logger: Logger = new Logger(InitializeGameService.name)

    constructor(@InjectModel(Game.name) public gameModel: Model<GameDocument>) {}

    /**
     * When all players join the game, we press the button for starting the game
     * @exception GameNotFoundException()
     * @exception NotEnoughPlayersForStartingGameException()
     */
    public async launchGame(): Promise<Game> {

        const tempCurrentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);

        if (tempCurrentGame === null) {
            throw new GameNotFoundException();
        }

        let currentGame: Game = tempCurrentGame;

        // We remove the players who didn't join the game (we propose 8 players, but if only 5 join,
        // we delete the remaining 4
        currentGame.players = currentGame.players.filter((p) => p.is_logged == true);

        if (currentGame.players.length < 2) {
            throw new NotEnoughPlayersForStartingGameException();
        }

        currentGame = await this.__initiateGameCards(currentGame);
        currentGame = await this.__initiateChrono(currentGame);

        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: 'after'});
    }

    public __initiateChrono(game: Game): Game {

        const chronoUpTo: string = new Date(((new Date()).setSeconds((new Date().getSeconds() + DURATION_PLAYER_CHOOSE_CARDS_IN_SECONDS)))).toISOString();
        game.in_game_property.chrono_up_to = chronoUpTo;

        game.players.forEach(p => {
            p.in_player_game_property.chrono_up_to = chronoUpTo;
        });

        return game
    }

    public __initiateGameCards(game: Game): Game {

        game.in_game_property.current_round = 1;

        // We generate the 104 cards of the game
        const gameCards: Card[] = this.__generateCardDeck();

        // We give 10 cards to each player
        game.players.forEach(player => {
            for (let i = 0; i < NUMBER_OF_CARDS_PER_PLAYER; i++) {
                // We check a second time for being sure that we don't give cards to unconnected players
                if (player.is_logged) {
                    player.cards.push(gameCards.pop());
                }
            }
        });

        // We create the initial card decks
        for (let i = 0; i < NUMBER_OF_DECKS; i++) {
            const stackCard: StackCard = new StackCard(i, gameCards.pop());
            game.in_game_property.stacks.push(stackCard)
        }

        game.in_game_property.deck = gameCards

        return game;
    }


    /**
     * When a player want to join the current game with an ID available on the table
     * @param playerId
     * @exception GameNotFoundException()
     * @exception UserNotFoundWhenJoinGameException()
     */
    public async playerJoinGame(playerId: string, username: string): Promise<Game> {

        const tempCurrentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);

        if (tempCurrentGame === null) {
            throw new GameNotFoundException();
        }

        const currentGame: Game = tempCurrentGame;

        let isPlayerFound: boolean = false;
        for (const p of currentGame.players) {
            if (p.id === playerId) {
                isPlayerFound = true;
                p.is_logged = true;
                p.username = username;
            }
        }

        if (!isPlayerFound) {
            throw new UserNotFoundWhenJoinGameException(playerId)
        }

        return this.gameModel.findOneAndUpdate(
            {_id: currentGame._id},
            {players: currentGame.players},
            {returnDocument: 'after'});
    }


    public __generateCardDeck(): Card[] {

        const cards: Card[] = [];

        const sevenCattleHeads: Array<number> = [55];
        const fiveCattleHeads: Array<number> = [11, 22, 33, 44, 66, 77, 88, 99];
        const threeCattleHeads: Array<number> = [
            10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
        ];
        const twoCattleHeads: Array<number> = [5, 15, 25, 35, 45, 65, 75, 85, 95];
        const allSeveralCattleHeads: number[] = [
            ...sevenCattleHeads,
            ...fiveCattleHeads,
            ...threeCattleHeads,
            ...twoCattleHeads,
        ];
        const oneCattleHeads: Array<number> = Array.from(
            { length: 104 },
            (_, i) => i + 1,
        ).filter((e) => !allSeveralCattleHeads.includes(e));

        sevenCattleHeads.forEach((c) => cards.push(new Card(c, 7)));
        fiveCattleHeads.forEach((c) => cards.push(new Card(c, 5)));
        threeCattleHeads.forEach((c) => cards.push(new Card(c, 3)));
        twoCattleHeads.forEach((c) => cards.push(new Card(c, 2)));
        oneCattleHeads.forEach((c) => cards.push(new Card(c, 1)));

        return EngineUtilsService.shuffle(cards);
    }
}
