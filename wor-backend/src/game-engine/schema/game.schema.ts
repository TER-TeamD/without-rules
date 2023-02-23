import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsArray, IsMongoId } from 'class-validator';
import { shuffle } from '../utils/utils';

export class InGameProperty {
  deck: Card[] = [];
  stacks: StackCard[] = [];
  current_round = 0;
  between_round: BetweenRound | null = null;

  chrono_up_to: string | null = null;

}

export type GameDocument = Game & Document;

@Schema({
  collection: 'game',
})
export class Game {

  @IsMongoId()
  public _id: string;

  @Prop({ required: true })
  @IsArray()
  public players: Player[];

  @Prop()
  public in_game_property: InGameProperty;


  constructor() {
    this.players = [];
    this.in_game_property = new InGameProperty();
  }
}

export const GameSchema = SchemaFactory.createForClass(Game);

export class Card {
  value: number;
  cattleHead: number;

  constructor(value: number, cattleHead: number) {
    this.value = value;
    this.cattleHead = cattleHead;
  }
}

export class StackCard {
  stackNumber: number;
  stackHead: Card;
  stackCards: Card[] = [];

  constructor(stackNumber: number, stackHead: Card) {
    this.stackNumber = stackNumber;
    this.stackHead = stackHead;
  }
}

export class Player {
  id: string;
  is_logged: boolean;
  username: string;
  avatar: string;
  cards: Card[];
  played_cards: Card[];
  in_player_game_property: InPlayerGameProperty | null;

  gameResult: PlayerGameResult;

  constructor() {
    this.id = (Math.random() + 1).toString(36).substring(6);
    this.is_logged = false;
    this.cards = [];
    this.in_player_game_property = new InPlayerGameProperty()
    this.played_cards = [];
    this.gameResult = new PlayerGameResult();
  }
}

export class PlayerGameResult {

  cattleHeads: number = 0;
  ranking: number = 0;

  constructor() {}
}

export class InPlayerGameProperty {
  played_card: Card | null;
  had_played_turn: boolean;
  player_discard: Card[] = [];
  chrono_up_to: string | null = null;

  constructor() {
    this.played_card = null
    this.had_played_turn = false
    this.player_discard = [];
  }
}

export class BetweenRound {

  current_player_action: BetweenRoundPlayerAction | null = null;
  index_current_player_action_in_player_order: number = 0;
  playerOrder: PlayerFlipOrder[];

  constructor() {
    this.playerOrder = [];
    this.current_player_action = null;
  }
}



export class PlayerFlipOrder {
  player: Player;
  order: number;

  constructor(player: Player, order: number) {
    this.player = player;
    this.order = order;
  }
}

export class BetweenRoundPlayerAction {
  player: Player;
  action: PlayerAction;

  constructor(player: Player, action: PlayerAction) {
    this.player = player;
    this.action = action;
  }
}

export abstract class PlayerAction {
  type: string;

  constructor(type: string) {
    this.type = type;
  }
}

export class SendCardToStackCardPlayerAction extends PlayerAction {
  stack_number: number;

  constructor(stack_number: number) {
    super("SEND_CARD_TO_STACK_CARD");
    this.stack_number = stack_number;
  }
}

export class SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction extends PlayerAction {
  stack_number: number;

  constructor(stack_number: number) {
    super("SEND_CARD_TO_STACK_CARD_AND_ADD_CARD_TO_PLAYER_DISCARD");
    this.stack_number = stack_number;
  }
}

export class ChooseStackCardPlayerAction extends PlayerAction {
  choosen_stack_card_by_player: number | null = null;
  chrono_up_to: string | null = null;


  constructor() {
    super("CHOOSE_STACK_CARD");
  }
}

export class NextRoundPlayerAction extends PlayerAction {
  constructor() {
    super("NEXT_ROUND");
  }
}




export enum ActionTypeEnum {
  PUSH_ON_TOP = 'PUSH_ON_TOP',
  CLEAR_PUSH = 'CLEAR_PUSH',
}

export class Action {
  type: ActionTypeEnum;
  player_id: string;
  stack: StackCard;

  constructor(type: ActionTypeEnum, player_id: string, stack: StackCard) {
    this.type = type;
    this.player_id = player_id;
    this.stack = stack;
  }
}



