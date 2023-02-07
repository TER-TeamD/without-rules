import 'dart:convert';

import 'package:flutter/widgets.dart';
import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/player_deck/states/no_player.dart';
import 'package:worfrontend/components/player_deck/states/played.dart';
import 'package:worfrontend/components/player_deck/states/playing.dart';
import 'package:worfrontend/components/player_deck/states/wait_other_players.dart';
import 'package:worfrontend/components/player_deck/states/wait_player.dart';
import 'package:worfrontend/errors/app_error.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/network/models/game_card.dart';
import 'package:worfrontend/services/network/models/models/between_round.dart';
import 'package:worfrontend/services/network/models/models/game.dart';
import 'package:worfrontend/services/network/models/models/player.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';
import 'package:worfrontend/services/network/socket_gateway.dart';
import 'package:worfrontend/services/screen_service.dart';
import 'package:worfrontend/services/network/models/models/player_action.dart';
import 'logger.dart';


class GameController {
  final BehaviorSubject<Game> game$;
  Map<String, DeckTransform> deckTransforms = {};
  final BehaviorSubject<Map<String, DeckTransform>> deckTransforms$ = BehaviorSubject.seeded({});
  PlayerActionPlayer? currentPlayerActionPlayer;
  final SocketGateway _socketGateway;


  final BehaviorSubject<bool> gameEnded$ = BehaviorSubject.seeded(false);

  int playingRound = 0;
  bool allPlayerPlayedForRound = false;
  bool gameIsFinished = false;

  GameController(Game game, this._socketGateway)
      : game$ = BehaviorSubject.seeded(game),
        deckTransforms = GetIt.I.get<ScreenService>().getMapPosition(game.players.map((e) => e.id).toList(growable: false))
  {
    deckTransforms$.add(deckTransforms);
    _socketGateway.onMessage.listen((value) {
      value.execute(this);
    });
  }


  void gameChanged(Game game, String topic) {
    Logger.log("Game changed.");

    BetweenRoundPlayerAction? action = game.inGameProperty?.betweenRound?.currentPlayerAction;

    if (action != null) {
      currentPlayerActionPlayer = PlayerActionPlayer(action.player, action.action);
    }

    if ((game.inGameProperty?.currentRound ?? 0) > playingRound) {
      playingRound = (game.inGameProperty?.currentRound ?? 0);
      allPlayerPlayedForRound = false;
    }

    var everyoneHadPlayed = game.players.every((element) => element.playerGameProperty?.hadPlayedTurn ?? false);
    if (everyoneHadPlayed && !allPlayerPlayedForRound) {
      _socketGateway.allPlayerPlayed();
      allPlayerPlayedForRound = true;
    }

    if (topic == "FLIP_CARD_ORDER") {

    }

    if (topic == "NEW_RESULT_ACTION" && !gameEnded$.value) {
      var d = game.inGameProperty?.betweenRound?.currentPlayerAction?.action;

      Future.delayed(Duration(milliseconds: 200), () {
        if (d != null && d.type == "CHOOSE_STACK_CARD") {
        } else if (d != null && d.type == "NEXT_ROUND") {
          if (gameIsFinished == false) {
            _socketGateway.nextRoundResultAction();
          }
        } else {
          if (gameIsFinished == false) {
            _socketGateway.nextRoundResultAction();
          }
        }
      });
    }

    if (topic == "END_GAME_RESULTS") {
      gameIsFinished = true;
      gameEnded$.add(true);
    }

    game$.add(game);
  }

  chooseCard(GameCard card) {}

  void startGame() {
    _socketGateway.startGame();
  }

  void deckTransformChanged(String playerId, DeckTransform transform) {
    deckTransforms[playerId] = transform;
    deckTransforms$.add(deckTransforms);
  }

  List<StackCard> getStacks() {
    return game$.value.inGameProperty?.stacks ?? [];
  }

  bool isGameStarted() {
    return (game$.value.inGameProperty?.currentRound ?? 0) > 0;
  }

  bool doUserShouldChoose() {
    return game$.value.inGameProperty?.betweenRound?.currentPlayerAction?.action.type == "CHOOSE_STACK_CARD";
  }

  void chooseStack(int stackNumber) {
    if(!doUserShouldChoose()) return;
    _socketGateway.nextRoundResultActionChoosingStack(stackNumber);
  }

  PlayerActionPlayer? getCurrentPlayerActionPlayer() {
    return currentPlayerActionPlayer;
  }

  Map<String, DeckTransform> getDeckTransforms() {
    return deckTransforms;
  }

  List<Player> getRank() {
    var result = game$.value.players.toList(growable: false);
    result.sort((a, b) => a.gameResult.ranking.compareTo(b.gameResult.ranking));
    return result;
  }
}

class PlayerActionPlayer {
  final Player _player;
  final PlayerAction _action;

  PlayerActionPlayer(this._player, this._action);

  Iterable<Widget> buildWidget(BuildContext context, SceneData sceneData) {
    return _action.buildWidget(context, sceneData, _player);
  }
}


Map<String, PositionedPlayerDeckState> getDecks(Game game, Map<String, DeckTransform> deckTransforms) {
  var gameStarted = (game.inGameProperty?.currentRound ?? 0) > 0;
  var betweenRound = game.inGameProperty?.betweenRound;

  return Map.fromEntries(game.players.map((p) {
    if (!p.isLogged && !gameStarted) {
      return MapEntry(p.id, DeckWaitPlayer(p.id));
    }

    if (p.isLogged && !gameStarted) {
      return MapEntry(p.id, DeckWaitOtherPlayers(p));
    }

    if (!p.isLogged && gameStarted) {
      return MapEntry(p.id, DeckNoPlayer(id: p.id));
    }

    if (betweenRound != null) {
      Logger.log(jsonEncode(betweenRound));
      var playerOrders = betweenRound.playerOrder;
      var ids = playerOrders.map((e) => e.player.id).toList(growable: false);
      if (!playerOrders.map((e) => e.player.id).contains(p.id)) {
        GetIt.I.get<ErrorManager>().throwError(
            UnexpectedError("Player could not be found ni PlayerFlipOrder"));
        throw "Player could not be found in PlayerFlipOrder";
      }

      var playerOrder = playerOrders.where((e) => e.player.id == p.id);
      if (playerOrder.isEmpty) {
        var error = UnexpectedError("No matching player in player order.");
        GetIt.I.get<ErrorManager>().throwError(error);
        throw error.screenMessage();
      }

      if (betweenRound.indexCurrentPlayerActionInPlayerOrder >=
          playerOrder.first.order) {
        return MapEntry(p.id, DeckPlayed(p.playerGameProperty!.playedCard!));
      } else {
        return MapEntry(p.id, DeckWaitOtherPlayers(p));
      }
    }

    if (p.playerGameProperty?.hadPlayedTurn ?? false) {
      return MapEntry(p.id, DeckWaitOtherPlayers(p));
    }

    return MapEntry(p.id, DeckPlaying());

    throw "Case not handled.";
  }).map((state) =>
      MapEntry(
          state.key,
          PositionedPlayerDeckState(
              state.key, state.value, deckTransforms[state.key]!)
      )));
}
