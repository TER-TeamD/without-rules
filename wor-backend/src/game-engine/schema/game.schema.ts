import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsArray, IsMongoId } from 'class-validator';
import { shuffle } from '../utils/utils';

export class InGameProperty {
  deck: Card[] = [];
  stacks: StackCard[] = [];
  current_round = 0;
  between_round: BetweenRound | null = null;


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
  cards: Card[];
  played_cards: Card[];
  in_player_game_property: InPlayerGameProperty | null;



  constructor() {
    this.id = (Math.random() + 1).toString(36).substring(5);
    this.is_logged = false;
    this.cards = [];
    this.in_player_game_property = new InPlayerGameProperty()
    this.played_cards = [];
  }
}

export class InPlayerGameProperty {
  played_card: Card | null;
  had_played_turn: boolean;
  player_discard: Card[] = [];

  constructor() {
    this.played_card = null
    this.had_played_turn = false
    this.player_discard = [];
  }
}

export class BetweenRound {

  current_player_action: BetweenRoundPlayerAction | null = null;
  playerOrder: PlayerFlipOrder[];

  constructor() {
    this.playerOrder = [];
    this.current_player_action = null;
  }
}



export class Result {
  id_player: string;
  cattle_heads: number;
  rank = 0;
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

}

export class SendCardToDeckPlayerAction extends PlayerAction {
  deck_number: number;

  constructor(deck_number: number) {
    super();
    this.deck_number = deck_number;
  }
}

export class ChooseDeckPlayerAction extends PlayerAction {

}

export class NextRoundPlayerAction extends PlayerAction {

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



