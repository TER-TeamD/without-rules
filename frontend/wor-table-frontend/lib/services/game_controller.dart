import 'dart:convert';

import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/components/player_deck/states/playing.dart';
import 'package:worfrontend/components/player_deck/states/wait_other_players.dart';
import 'package:worfrontend/errors/incoherent_message_for_state.dart';
import 'package:worfrontend/game_states/final_state.dart';
import 'package:worfrontend/game_states/wait_players.dart';
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/network/models/socket_models/results.dart';
import '../game_states/game_state.dart';
import '../game_states/wait_server.dart';
import 'network/models/action/action.dart';
import 'network/models/card.dart';
import 'network/models/socket_models/result.dart';
import 'network/models/stack_card.dart';

class GameController {
  Map<String, PlayerDeckState> decks = {};
  List<StackCard> stacks = [];
  GameState state = WaitServerState();

  GameController();

  T checkState<T extends GameState>(String action) {
    if (state is! T) {
      throw ErrorManager.handle(IncoherentActionForState(T.toString(), action));
    }
    return state as T;
  }

  void playerPlayCard(String playerId, Card playedCard) {
    checkState("playerPlayCard($playerId, ${playedCard.value})");
    decks[playerId] = DeckWaitOtherPlayers();
  }

  void initiateGame(List<StackCard> stacks) {
    checkState<WaitPlayerState>("initiateGame(${jsonEncode(stacks)})");
  }

  void playActions(List<Action> actions) {}

  void nextRound() {
    for (var element in decks.keys) {
      decks[element] = DeckPlaying();
    }
  }

  void showResult(List<Result> results) {
    state = FinalState(results);
  }

  void playerJoined(String playerId) {}
}
