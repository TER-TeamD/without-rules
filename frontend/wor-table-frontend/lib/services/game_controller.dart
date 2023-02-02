import 'dart:collection';

import 'package:flutter/widgets.dart';
import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/player_deck/states/no_player.dart';
import 'package:worfrontend/components/player_deck/states/played.dart';
import 'package:worfrontend/components/player_deck/states/playing.dart';
import 'package:worfrontend/components/player_deck/states/wait_other_players.dart';
import 'package:worfrontend/components/player_deck/states/wait_player.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/services/network/models/models/between_round.dart';
import 'package:worfrontend/services/network/models/models/game.dart';
import 'package:worfrontend/services/network/models/models/player.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';
import 'package:worfrontend/services/network/socket_gateway.dart';
import 'package:worfrontend/services/screen_service.dart';
import 'package:worfrontend/services/network/models/models/player_action.dart';
import 'network/models/card.dart';

enum GameStates {
  waitServer,
  waitPlayers,
  playing,
  animatingCards,
  choosingCard,
  finalPhase,
}

class PlayerActionPlayer {
  final Player _player;
  final PlayerAction _action;

  PlayerActionPlayer(this._player, this._action);

  Iterable<Widget> buildWidget(BuildContext context, SceneData sceneData) {
    return _action.buildWidget(context, sceneData, _player);
  }
}

class _State {
  final BehaviorSubject<Game> game$;
  final BehaviorSubject<Map<String, DeckTransform>> deckTransforms;
  PlayerActionPlayer? currentPlayerActionPlayer;

  _State(Game game)
      : game$ = BehaviorSubject.seeded(game),
        deckTransforms = BehaviorSubject.seeded(GetIt.I
            .get<ScreenService>()
            .getMapPosition(
                game.players.map((e) => e.id).toList(growable: false)));

  Map<String, PositionedPlayerDeckState> getDecks() {
    var gameStarted = (game$.value.inGameProperty?.currentRound ?? 0) > 0;
    var betweenRound = game$.value.inGameProperty?.betweenRound;

    return Map.fromEntries(game$.value.players.map((p) {
      if (!p.isLogged && !gameStarted) {
        return MapEntry(p.id, DeckWaitPlayer(p.id));
      }

      if (p.isLogged && !gameStarted) {
        return MapEntry(p.id, DeckWaitOtherPlayers());
      }

      if (!p.isLogged && gameStarted) {
        return MapEntry(p.id, DeckNoPlayer(id: p.id));
      }

      if (betweenRound != null) {
        var playerOrder = betweenRound.playerOrder
            .singleWhere((element) => element.player.id == p.id,
                orElse: () =>
                    throw "Player could not be found in PlayerFlipOrder")
            .order;

        if (betweenRound.indexCurrentPlayerActionInPlayerOrder >= playerOrder) {
          return MapEntry(p.id, DeckPlayed(p.playedCards.last));
        } else {
          return MapEntry(p.id, DeckWaitOtherPlayers());
        }
      }

      if (p.playerGameProperty?.hadPlayedTurn ?? false) {
        return MapEntry(p.id, DeckWaitOtherPlayers());
      }

      return MapEntry(p.id, DeckPlaying());

      throw "Case not handled.";
    }).map((state) => MapEntry(
        state.key,
        PositionedPlayerDeckState(
            state.key, state.value, deckTransforms.value[state.key]!))));
  }
}

class SocketGameController {
  final _State _state;

  SocketGameController(this._state);

  void gameChanged(Game game) {
    BetweenRoundPlayerAction? action =
        game.inGameProperty?.betweenRound?.currentPlayerAction;
    if (action != null) {
      _state.currentPlayerActionPlayer =
          PlayerActionPlayer(action.player, action.action);
    }
    _state.game$.add(game);
  }
}

class TableGameController {
  final _State _state;

  BehaviorSubject<Game> get gameChanged$ => _state.game$;

  TableGameController(this._state);

  chooseCard(GameCard card) {}

  void startGame() {
    GetIt.I.get<SocketGateway>().startGame();
  }

  void deckTransformChanged(String playerId, DeckTransform transform) {
    _state.deckTransforms.value[playerId] = transform;
    _state.deckTransforms.add(_state.deckTransforms.value);
  }

  Map<String, PositionedPlayerDeckState> getDecks() {
    return _state.getDecks();
  }

  List<StackCard> getStacks() {
    return _state.game$.value.inGameProperty?.stacks ?? [];
  }

  bool isGameStarted() {
    return (_state.game$.value.inGameProperty?.currentRound ?? 0) > 0;
  }

  PlayerActionPlayer? getCurrentPlayerActionPlayer() {
    return _state.currentPlayerActionPlayer;
  }
}

class GameControllers {
  late final _State _state;
  late final TableGameController tableGameController;
  late final SocketGameController socketGameController;

  GameControllers(Game game, SocketGateway gateway) {
    _state = _State(game);
    tableGameController = TableGameController(_state);
    socketGameController = SocketGameController(_state);

    gateway.onMessage.listen((event) {
      event.execute(socketGameController);
    });
  }
}
