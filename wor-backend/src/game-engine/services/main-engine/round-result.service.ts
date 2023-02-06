import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {
    BetweenRound, BetweenRoundPlayerAction,
    Card,
    ChooseStackCardPlayerAction,
    Game,
    GameDocument, NextRoundPlayerAction,
    Player,
    PlayerFlipOrder,
    SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction,
    SendCardToStackCardPlayerAction,
    StackCard
} from "../../schema/game.schema";
import {Model} from "mongoose";
import {EngineUtilsService} from "./engine-utils.service";
import {GameNotFoundException} from "./exceptions/game-not-found.exception";
import {MAX_CARDS_PER_STACK} from "../../config";
import {PlayerNotFoundException} from "./exceptions/player-not-found.exception";
import {StackNotFoundException} from "./exceptions/stack-not-found.exception";

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
        });

        currentGame.in_game_property.between_round.index_current_player_action_in_player_order = 0;

        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: "after"});
    }


    /**
     * Quand on fait l'analyse du round, il y a plusieurs actions possibles. Ces actions
     * sont générées grâce à cette méthode, il est donc nécessaire de la lancer jusqu'à ce que
     * la dernière action NextRoundPlayerAction (situé au niveau de game.between_round.current_player_action.
     * @exception GameNotFoundException()
     * @exception PlayerNotFoundException()
     * @exception StackNotFoundException()
     */
    public async generateNextAction(): Promise<Game> {
        let currentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);
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

        if (currentGame.in_game_property.between_round.index_current_player_action_in_player_order === currentGame.in_game_property.between_round.playerOrder.length) {
            // Nous avons fini le jeu
            currentGame.in_game_property.between_round.current_player_action.action = new NextRoundPlayerAction();
            this.logger.log("Oui")
        } else {
            this.logger.log("Oui2")
            if (currentGame.in_game_property.between_round.current_player_action !== null
                && currentGame.in_game_property.between_round.current_player_action.action instanceof ChooseStackCardPlayerAction) {

                this.logger.log("Oui3")
                // On reprend l'action actuel suite au choix d'un utilisateur de son tas
                const currentAction: ChooseStackCardPlayerAction = currentGame.in_game_property.between_round.current_player_action.action;

                currentGame = this.__updateGameWhenPlayerCase4(currentGame, currentAction)
                currentGame.in_game_property.between_round.index_current_player_action_in_player_order += 1;
            }
            const bestStackCardForPuttingCurrentPlayerCard: StackCard | null = this.__searchGoodStackCardForPlacingCard(currentGame);

            this.logger.log("Oui4")
            if (bestStackCardForPuttingCurrentPlayerCard === null) {
                this.logger.log("Oui5")
                // we are in the case 4 (rule 4 of the game)
                currentGame.in_game_property.between_round.current_player_action.action = new ChooseStackCardPlayerAction();
                // L'utilisateur doit aller donner le tas qu'il souhaite

            } else {
                this.logger.log("Oui6")
                // stackCards doesn't include the StackHead card, so in the stack, we have the card stackHead + stackCards[]
                if (bestStackCardForPuttingCurrentPlayerCard.stackCards.length === (MAX_CARDS_PER_STACK - 1)) {
                    this.logger.log("Oui7")
                    // we are in the case 3
                    currentGame = this.__updateGameWhenCase3(currentGame, bestStackCardForPuttingCurrentPlayerCard);
                    currentGame.in_game_property.between_round.index_current_player_action_in_player_order += 1;
                } else {
                    this.logger.log("Oui8")
                    // We are in the case 1 and 2
                    currentGame = this.__updateGameWhenCase1And2(currentGame, bestStackCardForPuttingCurrentPlayerCard);
                    currentGame.in_game_property.between_round.index_current_player_action_in_player_order += 1;
                }
            }
        }

        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: "after"});
    }


    public __updateGameWhenPlayerCase4(game: Game, currentAction: ChooseStackCardPlayerAction): Game {
        const currentIndexAction: number = game.in_game_property.between_round.index_current_player_action_in_player_order;
        const currentCard: Card = game.in_game_property.between_round.playerOrder[currentIndexAction].player.in_player_game_property.played_card;

        const currentIdPlayer: string = game.in_game_property.between_round.playerOrder[currentIndexAction].player.id;
        const currentPlayerIndex: number = game.players.findIndex(p => p.id === currentIdPlayer);
        if (currentPlayerIndex < 0) throw new PlayerNotFoundException(currentIdPlayer);
        const currentPlayer: Player = game.players[currentPlayerIndex];

        const indexStackCardPlayerChoose: number = game.in_game_property.stacks.findIndex(s => s.stackNumber === currentAction.choosen_stack_card_by_player);
        if (indexStackCardPlayerChoose < 0) throw new StackNotFoundException(currentAction.choosen_stack_card_by_player);
        const currentStack: StackCard = game.in_game_property.stacks[indexStackCardPlayerChoose];

        currentPlayer.in_player_game_property.player_discard.push(currentStack.stackHead)
        currentPlayer.in_player_game_property.player_discard.push(...currentStack.stackCards)

        currentStack.stackHead = currentCard;
        currentStack.stackCards = [];

        currentPlayer.cards = currentPlayer.cards.filter(c => c.value !== currentCard.value);
        currentPlayer.played_cards.push(currentCard);

        return game;
    }

    public __updateGameWhenCase1And2(game: Game, bestStackCard: StackCard): Game {
        const currentIndexAction: number = game.in_game_property.between_round.index_current_player_action_in_player_order;
        const currentCard: Card = game.in_game_property.between_round.playerOrder[currentIndexAction].player.in_player_game_property.played_card;

        const currentIdPlayer: string = game.in_game_property.between_round.playerOrder[currentIndexAction].player.id;
        const currentPlayerIndex: number = game.players.findIndex(p => p.id === currentIdPlayer);
        if (currentPlayerIndex < 0) throw new PlayerNotFoundException(currentIdPlayer);
        const currentPlayer: Player = game.players[currentPlayerIndex];

        if ( game.in_game_property.between_round.current_player_action === null) {
            game.in_game_property.between_round.current_player_action = new BetweenRoundPlayerAction(currentPlayer, null);
        }
        game.in_game_property.between_round.current_player_action.action = new SendCardToStackCardPlayerAction(bestStackCard.stackNumber);

        bestStackCard.stackCards.push(bestStackCard.stackHead);
        bestStackCard.stackHead = currentCard;

        currentPlayer.cards = currentPlayer.cards.filter(c => c.value !== currentCard.value);
        currentPlayer.played_cards.push(currentCard);

        return game;
    }

    public __updateGameWhenCase3(game: Game, bestStackCard: StackCard): Game {
        const currentIndexAction: number = game.in_game_property.between_round.index_current_player_action_in_player_order;
        const currentCard: Card = game.in_game_property.between_round.playerOrder[currentIndexAction].player.in_player_game_property.played_card;

        const currentIdPlayer: string = game.in_game_property.between_round.playerOrder[currentIndexAction].player.id;
        const currentPlayerIndex: number = game.players.findIndex(p => p.id === currentIdPlayer);
        if (currentPlayerIndex < 0) throw new PlayerNotFoundException(currentIdPlayer);
        const currentPlayer: Player = game.players[currentPlayerIndex];

        if ( game.in_game_property.between_round.current_player_action === null) {
            game.in_game_property.between_round.current_player_action = new BetweenRoundPlayerAction(currentPlayer, null);
        }
        game.in_game_property.between_round.current_player_action.action = new SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction(bestStackCard.stackNumber);


        currentPlayer.in_player_game_property.player_discard.push(bestStackCard.stackHead);
        currentPlayer.in_player_game_property.player_discard.push(...bestStackCard.stackCards);

        bestStackCard.stackCards = [];
        bestStackCard.stackHead = currentCard;

        currentPlayer.cards = currentPlayer.cards.filter(c => c.value !== currentCard.value);
        currentPlayer.played_cards.push(currentCard);

        return game;
    }

    /**
     *
     * @param game
     * @return StackCard if one found one, null if anty card have a number > at one stackhead
     */
    public __searchGoodStackCardForPlacingCard(game: Game): StackCard | null {

        const currentIndexAction: number = game.in_game_property.between_round.index_current_player_action_in_player_order;
        const currentCard: Card = game.in_game_property.between_round.playerOrder[currentIndexAction].player.in_player_game_property.played_card;

        const minimumVariation: {stack_card: StackCard, delta: number} = {stack_card: null, delta: 104}
        game.in_game_property.stacks.forEach(stack => {
            const currentDelta: number = currentCard.value - stack.stackHead.value;
            if (currentDelta > 0 && currentDelta <= minimumVariation.delta) {
                minimumVariation.stack_card = stack;
            }
        });

        return minimumVariation.stack_card;
    }
}
