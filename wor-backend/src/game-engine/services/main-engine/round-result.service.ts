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
import {
    DURATION_PLAYER_CHOOSE_STACK_CARDS_IN_SECONDS,
    MAX_CARDS_PER_STACK
} from "../../config";
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
            console.log("Nous avons fini le jeu")
            currentGame.in_game_property.between_round.current_player_action.action = new NextRoundPlayerAction();
        } else {
            console.log("Nous n'avons pas fini le jeu")

            if (currentGame.in_game_property.between_round.current_player_action !== null && currentGame.in_game_property.between_round.current_player_action.action.type === "CHOOSE_STACK_CARD") {
                console.log("Nous sommes dans le cas ou la précédente action est une CHOOSE_STACK_CARD, donc le player a du donner son stackcard")

                // On reprend l'action actuel suite au choix d'un utilisateur de son tas
                const currentAction: ChooseStackCardPlayerAction = currentGame.in_game_property.between_round.current_player_action.action as ChooseStackCardPlayerAction;

                console.log(currentAction)

                currentGame = this.__updateGameWhenPlayerCase4(currentGame, currentAction)
                currentGame.in_game_property.between_round.index_current_player_action_in_player_order += 1;
            }

            const bestStackCardForPuttingCurrentPlayerCard: StackCard | null = this.__searchGoodStackCardForPlacingCard(currentGame);
            console.log("Voici le meilleur stack card ou poser la carte ", bestStackCardForPuttingCurrentPlayerCard)

            if (bestStackCardForPuttingCurrentPlayerCard === null) {
                console.log("L'utilisateur peut choisir le tas de cate qu'il souhaite")
                // we are in the case 4 (rule 4 of the game)
                currentGame = this.__updateGameWhenPlayerHaveToClickOnStackCard(currentGame);
                // L'utilisateur doit aller donner le tas qu'il souhaite
            } else {
                console.log("L'utilisateur n'a pas le choix du tas ou poser sa carte")
                // stackCards doesn't include the StackHead card, so in the stack, we have the card stackHead + stackCards[]
                if (bestStackCardForPuttingCurrentPlayerCard.stackCards.length === (MAX_CARDS_PER_STACK - 1)
                    || (currentGame.in_game_property.between_round.current_player_action
                        && currentGame.in_game_property.between_round.current_player_action.action
                        && currentGame.in_game_property.between_round.current_player_action.action.type === "CHOOSE_STACK_CARD"
                    )
                ) {

                    console.log("Il faut d'abord check que l'ancien roundResult n'est pas un ChooseStackCard, car si ca en est un, il faut le mettre dans la défausse");

                    if (currentGame.in_game_property.between_round.current_player_action
                        && currentGame.in_game_property.between_round.current_player_action.action && currentGame.in_game_property.between_round.current_player_action.action.type === "CHOOSE_STACK_CARD") {
                        console.log("Comme CHOOSE_STACK_CARD, on doit déplacer dans la discard");
                        currentGame = await this.__updateWhenAfterChosseStackCard(currentGame);

                    } else {
                        console.log("La stack card centrale est full, une partie va dans la defausse du user")
                        // we are in the case 3
                        currentGame = this.__updateGameWhenCase3(currentGame, bestStackCardForPuttingCurrentPlayerCard);
                        currentGame.in_game_property.between_round.index_current_player_action_in_player_order += 1;
                    }

                } else {
                    console.log("Pas de stackCard max, pas le choix de la position")
                    // We are in the case 1 and 2
                    currentGame = this.__updateGameWhenCase1And2(currentGame, bestStackCardForPuttingCurrentPlayerCard);
                    currentGame.in_game_property.between_round.index_current_player_action_in_player_order += 1;
                }
            }
        }

        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: "after"});
    }

    public async __updateWhenAfterChosseStackCard(game: Game): Promise<Game> {
        const choosenStackCardPlayerAction: ChooseStackCardPlayerAction = game.in_game_property.between_round.current_player_action.action as ChooseStackCardPlayerAction;
        if (choosenStackCardPlayerAction.choosen_stack_card_by_player != null) {
            const index: number = game.in_game_property.stacks.findIndex(s => s.stackNumber === choosenStackCardPlayerAction.choosen_stack_card_by_player);
            if (index < 0) throw new StackNotFoundException(choosenStackCardPlayerAction.choosen_stack_card_by_player)
            const stackCardChoose: StackCard = game.in_game_property.stacks[index];


            const currentIndexAction: number = game.in_game_property.between_round.index_current_player_action_in_player_order - 1;
            const currentCard: Card = game.in_game_property.between_round.playerOrder[currentIndexAction].player.in_player_game_property.played_card;

            const currentIdPlayer: string = game.in_game_property.between_round.playerOrder[currentIndexAction].player.id;
            const currentPlayerIndex: number = game.players.findIndex(p => p.id === currentIdPlayer);
            if (currentPlayerIndex < 0) throw new PlayerNotFoundException(currentIdPlayer);
            const currentPlayer: Player = game.players[currentPlayerIndex];


            game.in_game_property.between_round.current_player_action.action = new SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction(stackCardChoose.stackNumber);
            game.in_game_property.between_round.current_player_action.player = currentPlayer;


            stackCardChoose.stackCards = [];
            stackCardChoose.stackHead = currentCard;

            game.in_game_property.stacks[index] = stackCardChoose

        }

        console.log(game.in_game_property.stacks)

        return game;
    }

    public __updateGameWhenPlayerHaveToClickOnStackCard(game: Game): Game {
        const currentIndexAction: number = game.in_game_property.between_round.index_current_player_action_in_player_order;
        const currentCard: Card = game.in_game_property.between_round.playerOrder[currentIndexAction].player.in_player_game_property.played_card;

        const currentIdPlayer: string = game.in_game_property.between_round.playerOrder[currentIndexAction].player.id;
        const currentPlayerIndex: number = game.players.findIndex(p => p.id === currentIdPlayer);
        if (currentPlayerIndex < 0) throw new PlayerNotFoundException(currentIdPlayer);
        const currentPlayer: Player = game.players[currentPlayerIndex];

        if ( game.in_game_property.between_round.current_player_action === null) {
            game.in_game_property.between_round.current_player_action = new BetweenRoundPlayerAction(currentPlayer, null);
        }

        const newPlayerAction: ChooseStackCardPlayerAction = new ChooseStackCardPlayerAction();
        newPlayerAction.chrono_up_to = new Date(((new Date()).setSeconds((new Date().getSeconds() + DURATION_PLAYER_CHOOSE_STACK_CARDS_IN_SECONDS)))).toISOString();

        game.in_game_property.between_round.current_player_action.action = newPlayerAction;

        return game;
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
        game.in_game_property.between_round.current_player_action.player = currentPlayer;

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
        game.in_game_property.between_round.current_player_action.player = currentPlayer;

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

    public async updateActionWhenChooseStackCard(choosen_stack: number): Promise<Game> {
        const currentGame: Game | null = await EngineUtilsService.getCurrentGame(this.gameModel);
        if (currentGame === null) throw new GameNotFoundException();

        const choosenStackCardPlayerAction: ChooseStackCardPlayerAction = new ChooseStackCardPlayerAction();
        choosenStackCardPlayerAction.choosen_stack_card_by_player = choosen_stack
        choosenStackCardPlayerAction.choosen_stack_card_by_player = choosen_stack;

        currentGame.in_game_property.between_round.current_player_action.action = choosenStackCardPlayerAction;

        return this.gameModel.findOneAndUpdate({_id: currentGame._id}, currentGame, {returnDocument: "after"});
    }
}
