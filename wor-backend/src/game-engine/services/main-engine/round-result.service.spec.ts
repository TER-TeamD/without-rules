import { Test, TestingModule } from '@nestjs/testing';
import { RoundResultService } from './round-result.service';
import {DuringRoundService} from "./during-round.service";
import {InitializeGameService} from "./initialize-game.service";
import {StartGameService} from "./start-game.service";
import {MongooseModule} from "@nestjs/mongoose";
import {BetweenRound, Card, Game, GameSchema, Player, PlayerFlipOrder, StackCard} from "../../schema/game.schema";

describe('RoundResultService', () => {
  let roundResultService: RoundResultService;
  let duringRoundService: DuringRoundService;
  let initializeGameService: InitializeGameService;
  let startGameService: StartGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundResultService, DuringRoundService, InitializeGameService, StartGameService],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017'),
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
      ],
    }).compile();

    roundResultService = module.get<RoundResultService>(RoundResultService);
    initializeGameService = module.get<InitializeGameService>(InitializeGameService);
    startGameService = module.get<StartGameService>(StartGameService)
    duringRoundService = module.get<DuringRoundService>(DuringRoundService);

  });

  it('scenario', async () => {
    let currentGame: Game = await startGameService.generateNewGame();

    const playerOneId: string = currentGame.players[0].id
    const playerTwoId: string = currentGame.players[1].id
    const playerThreeId: string = currentGame.players[2].id
    await initializeGameService.playerJoinGame(playerOneId, "")
    await initializeGameService.playerJoinGame(playerTwoId, "")
    await initializeGameService.playerJoinGame(playerThreeId, "")

    currentGame = await initializeGameService.launchGame();

    currentGame = await duringRoundService.newPlayerPlayed(currentGame.players[0].id, currentGame.players[0].cards[0].value);
    currentGame = await duringRoundService.newPlayerPlayed(currentGame.players[1].id, currentGame.players[1].cards[0].value);
    currentGame = await duringRoundService.newPlayerPlayed(currentGame.players[2].id, currentGame.players[2].cards[0].value);

    currentGame = await roundResultService.flipCardOrder()

    for (let i = 1; i < currentGame.in_game_property.between_round.playerOrder.length; i++) {
      const lastValue: number = currentGame.in_game_property.between_round.playerOrder[i-1].player.in_player_game_property.played_card.value
      const currentValue: number = currentGame.in_game_property.between_round.playerOrder[i].player.in_player_game_property.played_card.value

      expect(currentValue).toBeGreaterThan(lastValue);
    }

    expect(currentGame.in_game_property.between_round.index_current_player_action_in_player_order).toBe(0);

    // currentGame = await duringRoundService.nextRound();
    // expect(currentGame.in_game_property.between_round).toBe(null);

  });



  it('Test __searchGoodDeckForPlacingCard() normal', async () => {

    const game: Game = new Game()
    game._id = "1000";

    const card1: Card = new Card(10, 8); // stack 0
    const card2: Card = new Card(12, 8); // stack 1
    const card3: Card = new Card(20, 8); // P1
    const card4: Card = new Card(34, 8);
    const card5: Card = new Card(36, 8); // stack 2
    const card6: Card = new Card(42, 8); // P1
    const card7: Card = new Card(46, 8); // stack 3
    const card8: Card = new Card(54, 8); // P2
    const card9: Card = new Card(78, 8); // P2
    const card10: Card = new Card(103, 8);

    const player1: Player = new Player();
    player1.is_logged = true;
    player1.cards = [card3, card6];
    player1.in_player_game_property.played_card = card3;
    player1.in_player_game_property.had_played_turn = true;
    player1.in_player_game_property.player_discard = [];

    const player2: Player = new Player();
    player2.is_logged = true;
    player2.cards = [card9, card8];
    player2.in_player_game_property.played_card = card8;
    player2.in_player_game_property.had_played_turn = true;
    player2.in_player_game_property.player_discard = [];

    game.players = [player1, player2];

    const stack1: StackCard = new StackCard(0, card1)
    const stack2: StackCard = new StackCard(1, card2)
    const stack3: StackCard = new StackCard(2, card5)
    const stack4: StackCard = new StackCard(3, card7)

    game.in_game_property.stacks = [stack1, stack2, stack3, stack4];
    game.in_game_property.current_round = 1;
    game.in_game_property.deck = [];
    game.in_game_property.between_round = new BetweenRound()
    game.in_game_property.between_round.index_current_player_action_in_player_order = 0
    game.in_game_property.between_round.playerOrder = [
        new PlayerFlipOrder(player1, 0),
        new PlayerFlipOrder(player2, 1),
    ];

    let goodStackCard: StackCard = roundResultService.__searchGoodStackCardForPlacingCard(game);
    expect(goodStackCard.stackNumber).toBe(1);

    game.in_game_property.between_round.index_current_player_action_in_player_order = 1;
    goodStackCard = roundResultService.__searchGoodStackCardForPlacingCard(game);
    expect(goodStackCard.stackNumber).toBe(3);
  });

  it('Test __searchGoodDeckForPlacingCard() when player card is less than first stack head', async () => {

    const game: Game = new Game()
    game._id = "1000";

    const card1: Card = new Card(10, 8); // P1
    const card2: Card = new Card(12, 8); // stack 1
    const card3: Card = new Card(20, 8); // stack 2
    const card4: Card = new Card(34, 8);
    const card5: Card = new Card(36, 8);
    const card6: Card = new Card(42, 8);
    const card7: Card = new Card(46, 8);
    const card8: Card = new Card(54, 8); // P2
    const card9: Card = new Card(78, 8);
    const card10: Card = new Card(103, 8);

    const player1: Player = new Player();
    player1.is_logged = true;
    player1.cards = [card1];
    player1.in_player_game_property.played_card = card1;
    player1.in_player_game_property.had_played_turn = true;
    player1.in_player_game_property.player_discard = [];

    const player2: Player = new Player();
    player2.is_logged = true;
    player2.cards = [card8];
    player2.in_player_game_property.played_card = card8;
    player2.in_player_game_property.had_played_turn = true;
    player2.in_player_game_property.player_discard = [];

    game.players = [player1, player2];

    const stack1: StackCard = new StackCard(0, card2)
    const stack2: StackCard = new StackCard(1, card3)

    game.in_game_property.stacks = [stack1, stack2];
    game.in_game_property.current_round = 1;
    game.in_game_property.deck = [];
    game.in_game_property.between_round = new BetweenRound()
    game.in_game_property.between_round.index_current_player_action_in_player_order = 0
    game.in_game_property.between_round.playerOrder = [
      new PlayerFlipOrder(player1, 0),
      new PlayerFlipOrder(player2, 1),
    ];

    let goodStackCard: StackCard = roundResultService.__searchGoodStackCardForPlacingCard(game);
    expect(goodStackCard).toBe(null);
  });

  it('Test __updateGameWhenCase1And2()', async () => {

    const game: Game = new Game()
    game._id = "1000";

    const card1: Card = new Card(10, 8); // P1
    const card2: Card = new Card(12, 8); // stack 1
    const card3: Card = new Card(20, 8); // stack 2
    const card4: Card = new Card(34, 8);
    const card5: Card = new Card(36, 8);
    const card6: Card = new Card(42, 8);
    const card7: Card = new Card(46, 8); // stack 3
    const card8: Card = new Card(54, 8); // P2
    const card9: Card = new Card(78, 8);
    const card10: Card = new Card(103, 8); // stack 4

    const player1: Player = new Player();
    player1.is_logged = true;
    player1.cards = [card1];
    player1.in_player_game_property.played_card = card1;
    player1.in_player_game_property.had_played_turn = true;
    player1.in_player_game_property.player_discard = [];

    const player2: Player = new Player();
    player2.is_logged = true;
    player2.cards = [card8];
    player2.in_player_game_property.played_card = card8;
    player2.in_player_game_property.had_played_turn = true;
    player2.in_player_game_property.player_discard = [];

    game.players = [player1, player2];

    const stack1: StackCard = new StackCard(0, card2)
    const stack2: StackCard = new StackCard(1, card3)
    const stack3: StackCard = new StackCard(2, card7)
    const stack4: StackCard = new StackCard(3, card10)

    game.in_game_property.stacks = [stack1, stack2, stack3, stack4];
    game.in_game_property.current_round = 1;
    game.in_game_property.deck = [];
    game.in_game_property.between_round = new BetweenRound()
    game.in_game_property.between_round.index_current_player_action_in_player_order = 0
    game.in_game_property.between_round.playerOrder = [
      new PlayerFlipOrder(player1, 0),
      new PlayerFlipOrder(player2, 1),
    ];

    let newGame: Game = roundResultService.__updateGameWhenCase1And2(game, stack1);
    expect(newGame.players[0].played_cards.length).toBe(1);
    expect(newGame.players[0].played_cards[0].value).toBe(card1.value);
    expect(newGame.players[0].cards.length).toBe(0);
    expect(newGame.players[0].in_player_game_property.player_discard.length).toBe(0);

    expect(newGame.in_game_property.stacks[0].stackHead.value).toBe(card1.value);
    expect(newGame.in_game_property.stacks[0].stackCards.length).toBe(1);
    expect(newGame.in_game_property.stacks[0].stackCards[0].value).toBe(card2.value);
  })



  it('Test __updateGameWhenCase3()', async () => {

    const game: Game = new Game()
    game._id = "1000";

    const card1: Card = new Card(10, 8); // P1
    const card2: Card = new Card(12, 8); // stack 1
    const card3: Card = new Card(20, 8); // stack 2
    const card4: Card = new Card(34, 8);
    const card5: Card = new Card(36, 8);
    const card6: Card = new Card(42, 8);
    const card7: Card = new Card(46, 8); // stack 3
    const card8: Card = new Card(54, 8); // P2
    const card9: Card = new Card(78, 8);
    const card10: Card = new Card(103, 8); // stack 4

    const player1: Player = new Player();
    player1.is_logged = true;
    player1.cards = [card1];
    player1.in_player_game_property.played_card = card1;
    player1.in_player_game_property.had_played_turn = true;
    player1.in_player_game_property.player_discard = [];

    const player2: Player = new Player();
    player2.is_logged = true;
    player2.cards = [card8];
    player2.in_player_game_property.played_card = card8;
    player2.in_player_game_property.had_played_turn = true;
    player2.in_player_game_property.player_discard = [];

    game.players = [player1, player2];

    const stack1: StackCard = new StackCard(0, card2)
    const stack2: StackCard = new StackCard(1, card3)
    const stack3: StackCard = new StackCard(2, card7)
    const stack4: StackCard = new StackCard(3, card10)

    game.in_game_property.stacks = [stack1, stack2, stack3, stack4];
    game.in_game_property.current_round = 1;
    game.in_game_property.deck = [];
    game.in_game_property.between_round = new BetweenRound()
    game.in_game_property.between_round.index_current_player_action_in_player_order = 0
    game.in_game_property.between_round.playerOrder = [
      new PlayerFlipOrder(player1, 0),
      new PlayerFlipOrder(player2, 1),
    ];

    let newGame: Game = roundResultService.__updateGameWhenCase3(game, stack1);
    expect(newGame.players[0].played_cards.length).toBe(1);
    expect(newGame.players[0].played_cards[0].value).toBe(card1.value);
    expect(newGame.players[0].cards.length).toBe(0);
    expect(newGame.players[0].in_player_game_property.player_discard.length).toBe(1);
    expect(newGame.players[0].in_player_game_property.player_discard[0].value).toBe(card2.value);

    expect(newGame.in_game_property.stacks[0].stackHead.value).toBe(card1.value);
    expect(newGame.in_game_property.stacks[0].stackCards.length).toBe(0);
  })



});
