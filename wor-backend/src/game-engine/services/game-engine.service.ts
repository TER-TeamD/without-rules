import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { NewGameDto } from "../dto/new-game.dto";
import { InjectModel } from "@nestjs/mongoose";
import {
    Action,
    ActionTypeEnum,
    Card,
    Game,
    GameDocument,
    generateCardDeck,
    InGameProperty,
    InPlayerGameProperty,
    Player, Result,
    StackCard
} from "../schema/game.schema";
import { Model } from "mongoose";
import { StatusDto } from "../dto/status.dto";
import { PlayedCardDto } from "../dto/played-card.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
    sortPlayerByCardsIncreasingOrder,
    sortResultByCattleHead,
    sortStackCardsByHeadCardsIncreasingOrder
} from "../utils/utils";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@Injectable()
export class GameEngineService implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) { }

    onModuleInit(): any {
        this.server.on('connection', socket => {
            console.log(socket.id);
            console.log("Connected")
        })
    }

    public async createNewGame(): Promise<NewGameDto> {

        const existingGames: Game[] = await this.gameModel.find({});

        if (existingGames.length != 0) {
            throw new HttpException('A game is existing, please delete game before', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const game: Game = new Game();
        game.players = [];
        for (let i = 1; i <= 2; i++) {
            const player: Player = new Player();
            player.cards = [];
            player.id = (Math.random() + 1).toString(36).substring(5)
            player.is_logged = false;
            player.in_player_game_property = new InPlayerGameProperty();
            player.in_player_game_property.had_played_turn = false;
            game.players.push(player);
        }

        const gameInDB: Game = await this.gameModel.create(game);

        const newGameDto: NewGameDto = new NewGameDto();
        newGameDto.id_game = gameInDB._id;
        newGameDto.potential_players_id = gameInDB.players.map<string>(p => p.id)

        return newGameDto;
    }

    public async deleteGame(): Promise<StatusDto> {
        await this.gameModel.deleteMany({});
        return new StatusDto();
    }


    public async playerWantToJoinAGame(idPlayer: string): Promise<Player> {

        const game: Game = await this.gameModel.findOne({ 'players.id': idPlayer })

        if (!game) {
            throw new HttpException(`Any game found with this player`, HttpStatus.NOT_ACCEPTABLE)
        }

        const index = game.players.findIndex(p => p.id === idPlayer)
        if (index < 0) {
            throw new HttpException(`Error during searching process`, HttpStatus.UNPROCESSABLE_ENTITY)
        }

        game.players[index].is_logged = true;

        const updatedGame: Game = await this.gameModel.findOneAndUpdate({ 'players.id': idPlayer }, { 'players': game.players }, { returnDocument: 'after' })

        return game.players[index];
    }

    public async startGame(): Promise<Game> {
        const games: Game[] = await this.gameModel.find({})

        if (games.length === 0) {
            throw new HttpException(`Any game found`, HttpStatus.NOT_FOUND)
        }

        const game: Game = games[0];

        game.players = game.players.filter(p => p.is_logged == true);

        if (game.players.length < 2) {
            throw new HttpException(`You cannot start a game with less than 2 players`, HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const updatedGame: Game = await this.gameModel.findOneAndUpdate({ '_id': game._id }, { 'players': game.players }, { returnDocument: 'after' })

        await this.initiateGameCards(updatedGame._id);

        return updatedGame;
    }


    private async initiateGameCards(idGame: string) {
        const game: Game = await this.gameModel.findOne({ '_id': idGame })

        if (!game) {
            throw new HttpException(`Any game found`, HttpStatus.NOT_ACCEPTABLE)
        }

        game.in_game_property = new InGameProperty();
        game.in_game_property.deck = generateCardDeck();
        game.in_game_property.current_round = 1;

        // We add 4 stackCards
        for (let i = 0; i < 4; i++) {
            game.in_game_property.stacks.push(new StackCard(i, game.in_game_property.deck.pop()))
        }

        // We give 10 cards to each player
        game.players.forEach(player => {
            for (let i = 0; i < 10; i++) {
                player.cards.push(game.in_game_property.deck.pop())
            }
        })

        const gameWithDeck: Game = await this.gameModel.findOneAndUpdate({ '_id': game._id }, { 'in_game_property': game.in_game_property, 'players': game.players }, { returnDocument: 'after' })

        for (const p of game.players) {
            await this.giveCardsToPlayerAtTheBeginningOfGame(p.id, p.cards)
        }

        await this.giveCardsToTableAtTheBeginningOfGame(game._id, game.in_game_property.stacks)
    }


    public async playerPlayedACard(idPlayer: string, body: PlayedCardDto): Promise<StatusDto> {

        const game: Game = await this.gameModel.findOne({ 'players.id': idPlayer })

        if (!game) {
            throw new HttpException(`Any game found with this player`, HttpStatus.NOT_ACCEPTABLE)
        }

        const index = game.players.findIndex(p => p.id === idPlayer)
        if (index < 0) {
            throw new HttpException(`Error during searching process`, HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const player: Player = game.players[index]

        if (player.in_player_game_property.had_played_turn) {
            throw new HttpException(`played cannot played 2 times in the same turn`, HttpStatus.NOT_ACCEPTABLE)
        }

        const cardIndex: number = player.cards.findIndex(c => c.value == body.card_value)
        if (cardIndex < 0) {
            throw new HttpException(`Any card with this value for this player`, HttpStatus.NOT_ACCEPTABLE)
        }

        const cardPlayed: Card = player.cards[cardIndex];
        player.in_player_game_property.played_card = cardPlayed;
        player.in_player_game_property.had_played_turn = true;

        const gameWithDeck: Game = await this.gameModel.findOneAndUpdate({ '_id': game._id }, { 'players': game.players }, { returnDocument: 'after' })
        await this.sendToTableCardsPlayedByPlayers(game._id, player.id, cardPlayed)

        await this.verifyEndTurn()

        return new StatusDto();
    }




    public async verifyEndTurn() {
        const games: Game[] = await this.gameModel.find({})

        if (games.length === 0) {
            throw new HttpException(`Any game found`, HttpStatus.NOT_FOUND)
        }

        const game: Game = games[0];

        const playersWhoDidntPlayed: Player[] = game.players.filter(p => p.in_player_game_property.had_played_turn == false);

        if (playersWhoDidntPlayed.length === 0) {
            await this.endTurn();
        }
    }


    private async endTurn() {
        console.log('end_turn')

        const games: Game[] = await this.gameModel.find({})

        if (games.length === 0) {
            throw new HttpException(`Any game found`, HttpStatus.NOT_FOUND)
        }

        const game: Game = games[0];

        // Send actions to do at the table
        const playerOrderByIncreasingCardValue: Player[] = sortPlayerByCardsIncreasingOrder(game.players);
        const stackCardInDecreasingOrder: StackCard[] = sortStackCardsByHeadCardsIncreasingOrder(game.in_game_property.stacks)

        const actions: Action[] = [];


        for (const player of playerOrderByIncreasingCardValue) {
            console.log(player.id)

            let lastCard: Card | null = null;
            for (const stack of stackCardInDecreasingOrder) {
                const playerHeadCardValue: number = player.in_player_game_property.played_card.value
                console.log("PlayedCardValue", playerHeadCardValue)

                if (playerHeadCardValue < stack.stackHead.value && lastCard === null) {
                    console.log("defosse")
                    // We need to recreate a new stack and add the card to the defosse du player
                    player.in_player_game_property.player_discard.push(...stack.stackCards)
                    stack.stackHead = player.in_player_game_property.played_card
                    stack.stackCards = [stack.stackHead]
                    player.cards = player.cards.filter(c => c.value !== player.in_player_game_property.played_card.value);
                    player.in_player_game_property.played_card = null;
                    player.in_player_game_property.had_played_turn = false

                    actions.push(new Action(ActionTypeEnum.CLEAR_PUSH, player.id, stack))
                    lastCard = stack.stackHead;
                    break;
                }

                // if (lastCard !== null && playerHeadCardValue > stack.stackHead.value) {
                if (playerHeadCardValue > stack.stackHead.value) {
                    // Player put his card here
                    console.log("Cardd")
                    stack.stackCards.push(player.in_player_game_property.played_card)
                    stack.stackHead = player.in_player_game_property.played_card
                    player.cards = player.cards.filter(c => c.value !== player.in_player_game_property.played_card.value);
                    player.in_player_game_property.played_card = null;
                    player.in_player_game_property.had_played_turn = false

                    actions.push(new Action(ActionTypeEnum.PUSH_ON_TOP, player.id, stack))
                    lastCard = stack.stackHead;
                    break;
                }

                lastCard = stack.stackHead;
            }
        }


        const gameUpdated: Game = await this.gameModel.findOneAndUpdate(
            { '_id': game._id },
            { 'players': game.players, 'in_game_property': game.in_game_property },
            { returnDocument: 'after' });


        await this.sendActionListToTable(gameUpdated._id, actions);

        // Send results to players dans table or next round
        if (gameUpdated.in_game_property.current_round >= 10) {
            await this.endGame();
        } else {
            await this.launchNextRound(gameUpdated);
        }

    }


    private async launchNextRound(game: Game): Promise<void> {
        game.in_game_property.current_round = game.in_game_property.current_round + 1;
        const gameUpdated: Game = await this.gameModel.findOneAndUpdate(
            { '_id': game._id },
            { 'in_game_property': game.in_game_property },
            { returnDocument: 'after' });

        await this.sendNextRound();
    }

    private async endGame() {
        const games: Game[] = await this.gameModel.find({})

        if (games.length === 0) {
            throw new HttpException(`Any game found`, HttpStatus.NOT_FOUND)
        }

        const game: Game = games[0];

        const results: Result[] = [];

        game.players.forEach(p => {
            const result: Result = new Result();
            result.id_player = p.id
            result.cattle_heads = p.in_player_game_property.player_discard.reduce((a, b) => a + b.value, 0);
            results.push(result)
        });

        const rankedResults: Result[] = sortResultByCattleHead(results);
        for (let i = 0; i < rankedResults.length; i++) {
            rankedResults[i].rank = i + 1;
        }

        await this.sendResultToAll(game._id, rankedResults)
        await this.gameModel.deleteMany({});
    }













    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body)
        this.server.emit('newMessage', {
            msg: "New message",
            content: body
        })
    }




    private async sendNextRound() {
        this.server.emit('table', {
            type: 'NEXT_ROUND',
        })

        this.server.emit('player', {
            type: 'NEXT_ROUND',
        })
    }

    private async giveCardsToPlayerAtTheBeginningOfGame(idPlayer: string, cards: Card[]) {
        this.server.emit('player', {
            type: 'INITIATE_GAME',
            value: {
                id_player: idPlayer,
                cards: cards,
            }
        })
    }

    private async giveCardsToTableAtTheBeginningOfGame(idGame: string, stacks: StackCard[]) {
        this.server.emit('table', {
            type: 'INITIATE_GAME',
            value: {
                id_game: idGame,
                stacks: stacks
            }
        })
    }

    private async sendToTableCardsPlayedByPlayers(idGame: string, playerId: string, playedCard: Card) {
        this.server.emit('table', {
            type: 'CARD_PLAYED_BY_USER',
            value: {
                id_game: idGame,
                player_id: playerId,
                played_cards: playedCard
            }
        })
    }

    private async sendActionListToTable(idGame: string, actions: Action[]) {
        this.server.emit('table', {
            type: 'NEW_ACTIONS',
            value: {
                id_game: idGame,
                actions: actions
            }
        })
    }

    private async sendResultToAll(idGame: string, results: Result[]) {
        this.server.emit('table', {
            type: 'RESULTS',
            value: {
                id_game: idGame,
                results: results
            }
        })

        this.server.emit('player', {
            type: 'RESULTS',
            value: {
                id_game: idGame,
                results: results
            }
        })
    }
}
