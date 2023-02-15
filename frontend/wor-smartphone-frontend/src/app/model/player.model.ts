export interface Player {
  id: string;
  username: string;
  avatar: string;

  is_logged: boolean;
  cards: Card[];
  played_cards: Card[];
  in_player_game_property: InPlayerGameProperty | null;

  gameResult: PlayerGameResult;
}

export interface Card {
  state: string;
  value: number;
  cattleHead: number;
}

export interface InPlayerGameProperty {
  played_card: Card | null;
  had_played_turn: boolean;
  player_discard: Card[];
  chrono_up_to: any;
}

export interface PlayerGameResult {
  cattleHeads: number;
  ranking: number;
}
