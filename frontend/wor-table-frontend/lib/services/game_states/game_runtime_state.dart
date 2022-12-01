import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/scenes/game_scene.dart';
import 'package:worfrontend/services/game_states/game_state.dart';
import 'package:worfrontend/services/network/models/action/action_types.dart';
import 'package:worfrontend/services/network/models/card.dart';
import 'package:worfrontend/services/network/models/socket_models/card_played_by_user.dart';
import 'package:worfrontend/services/network/models/socket_models/new_actions.dart';
import 'package:worfrontend/services/network/socket_message.dart/socket_message.dart';
import 'package:worfrontend/services/table_service.dart';

import '../network/models/game.dart';

class PlayerPlayingState {
  final String id;
  final List<Card> throwed = List<Card>.empty(growable: true);
  bool played = false;

  PlayerPlayingState(this.id);

  appendCard(Card card) {
    throwed.add(card);
  }

  appendCards(Iterable<Card> cards) {
    throwed.addAll(cards);
  }
}

class GameRuntimeState extends GameState {
  late StreamSubscription<SocketMessage> playerChooseSubs, gameAction;
  final Game game;
  final List<PlayerPlayingState> states;
  final GameSceneState guiState;

  final List<CardPlayedByUser> playedMessages = List.empty(growable: true);

  GameRuntimeState(super.runtimeService, this.game)
      : states = game.players
            .map((p) => PlayerPlayingState(p.id))
            .toList(growable: false),
        guiState = GameSceneState(
            game.inGameProperty.stacks, GetIt.I.get<TableService>().players!);

  @override
  void onLoad() {
    guiState.setTurnStart();
    playerChooseSubs =
        GetIt.I.get<TableService>().listen<CardPlayedByUser>((message) {
      states
          .firstWhere((element) => element.id == message.playerId,
              orElse: () => throw "Player not found.")
          .played = true;
      playedMessages.add(message);
      guiState.setPlayerPlayed(message.playerId);
      if (states.every((element) => element.played)) turnEnd();
    });

    gameAction =
        GetIt.I.get<TableService>().listen<NewActions>((message) async {
      for (int i = 0; i < message.actions.length; i++) {
        var action = message.actions[i];
        var playerState = states.firstWhere(
            (element) => element.id == action.playerId,
            orElse: () => throw "Player not found.");

        playerState.played = false;
        switch (action.type) {
          case ActionTypes.pushOnTop:
            break;
          case ActionTypes.clearPush:
            playerState.appendCards(
                guiState.stacks[action.stack.stackNumber].stackCards);
            break;
        }
        guiState.stacks[action.stack.stackNumber] = action.stack;
        guiState.setStacks(guiState.stacks);
        guiState.unsetPlayerPlayed(action.playerId);
        if (states.every((element) => !element.played)) {
          guiState.resetPlayerPlayed();
        }

        await Future.delayed(const Duration(seconds: 1));
      }
    });
  }

  playerChose(String idPlayer) {
    guiState.setPlayerPlayed(idPlayer);
  }

  turnEnd() {
    playerChooseSubs.cancel();
    for (var message in playedMessages) {
      guiState.setPlayerPlayedCard(message.playerId, message.playedCard);
    }
  }

  @override
  Widget buildUI(BuildContext context) {
    return GameScene(guiState: guiState);
  }
}
