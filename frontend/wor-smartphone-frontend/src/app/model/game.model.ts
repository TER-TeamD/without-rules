import { Card, Player } from "./player.model";


export interface Game {
  _id: string;
  players: Player[];
  in_game_property: InGameProperty;
}

export interface InGameProperty {
  deck: Card[];
  stacks: StackCard[];
  current_round: number;
  between_round: BetweenRound | null;
  chrono_up_to: string | null;
}

export interface StackCard {
  stackNumber: number;
  stackHead: Card;
  stackCards: Card[];
}

export interface BetweenRound {

  current_player_action: BetweenRoundPlayerAction | null;
  index_current_player_action_in_player_order: number;
  playerOrder: PlayerFlipOrder[];
}

export interface PlayerFlipOrder {
  player: Player;
  order: number;
}

export interface BetweenRoundPlayerAction {
  player: Player;
  action: PlayerAction;
}

export enum PlayerActionType {
  CHOOSE_STACK_CARD = "CHOOSE_STACK_CARD",
  NEXT_ROUND = "NEXT_ROUND",
  SEND_CARD_TO_STACK_CARD_AND_ADD_CARD_TO_PLAYER_DISCARD = "SEND_CARD_TO_STACK_CARD_AND_ADD_CARD_TO_PLAYER_DISCARD",
  SEND_CARD_TO_STACK_CARD = "SEND_CARD_TO_STACK_CARD",
}

export interface PlayerAction {
  type: PlayerActionType;
  stack_number: number;
  choosen_stack_card_by_player: number | null;
  chrono_up_to: any;
}
