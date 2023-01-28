import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsArray, IsMongoId } from 'class-validator';
import { shuffle } from '../utils/utils';

export class InGameProperty {
  deck: Card[] = [];
  stacks: StackCard[] = [];
  current_round = 0;
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
  in_player_game_property: InPlayerGameProperty | null;


  constructor() {
    this.id = (Math.random() + 1).toString(36).substring(5);
    this.is_logged = false;
    this.cards = [];
    this.in_player_game_property = new InPlayerGameProperty()
  }
}

export class InPlayerGameProperty {
  played_card: Card | null;
  had_played_turn: boolean;
  player_discard: Card[] = [];

  constructor() {
    this.played_card = null
    this.had_played_turn = false
    this.player_discard = []
  }

}

export class Card {
  value: number;
  cattleHead: number;

  constructor(value: number, cattleHead: number) {
    this.value = value;
    this.cattleHead = cattleHead;
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

export class Result {
  id_player: string;
  cattle_heads: number;
  rank = 0;
}

export function generateCardDeck(): Card[] {
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

  return shuffle(cards);
}
