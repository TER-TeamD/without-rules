import 'dart:async';
import 'dart:convert';

import 'package:flutter/widgets.dart';
import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/components/player_deck/states/no_player.dart';
import 'package:worfrontend/components/player_deck/states/played.dart';
import 'package:worfrontend/components/player_deck/states/playing.dart';
import 'package:worfrontend/components/player_deck/states/wait_other_players.dart';
import 'package:worfrontend/components/player_deck/states/wait_player.dart';
import 'package:worfrontend/components/player_deck_footer/player_deck_footer_state.dart';
import 'package:worfrontend/components/player_deck_footer/states/user_and_cattleheads_player_deck_footer_state.dart';
import 'package:worfrontend/components/player_deck_footer/states/user_player_deck_footer_state.dart';
import 'package:worfrontend/errors/app_error.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/models/transform.dart';
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/network/models/chronometer_data.dart';
import 'package:worfrontend/services/network/models/game_card.dart';
import 'package:worfrontend/services/network/models/models/game.dart';
import 'package:worfrontend/services/network/models/models/player.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';
import 'package:worfrontend/services/network/socket_gateway.dart';
import 'package:worfrontend/services/screen_service.dart';
import 'package:worfrontend/services/network/models/models/player_action.dart';
import '../components/player_deck_footer/states/text_player_deck_footer_state.dart';
import 'logger.dart';
import 'network/models/models/player_actions/choose_stack_card_player_action.dart';

class GameController {
  final BehaviorSubject<Game> game$;
  Map<String, AppTransform> deckTransforms = {};
  final BehaviorSubject<Map<String, AppTransform>> deckTransforms$ =
      BehaviorSubject.seeded({});
  final BehaviorSubject<String?> lastTopic$ = BehaviorSubject.seeded(null);
  final BehaviorSubject<PlayerActionPlayer?> currentPlayerActionPlayer =
      BehaviorSubject.seeded(null);
  final BehaviorSubject<Set<int>> animatedCards$ = BehaviorSubject<Set<int>>.seeded(<int>{});
  final SocketGateway _socketGateway;
  Game? previousGame = null;

  final BehaviorSubject<ChronometerData?> chronometer$ = BehaviorSubject.seeded(null);

  final Subject<int> stackChosen$ = PublishSubject();

  final BehaviorSubject<bool> gameEnded$ = BehaviorSubject.seeded(false);

  final BehaviorSubject<bool> promptChooseCard$ = BehaviorSubject.seeded(false);

  final Subject onRestartGame$ = PublishSubject();

  int playingRound = 0;
  bool allPlayerPlayedForRound = false;
  bool gameIsFinished = false;
  int animationStep = 0;
  Player? choosingPlayer = null;
  String lastTopic = '';



  final PlayerActionPlayer? currentAction = null;

  GameController(Game game, this._socketGateway)
      : game$ = BehaviorSubject.seeded(game),
        deckTransforms = GetIt.I.get<ScreenService>().getMapPosition(
            game.players.map((e) => e.id).toList(growable: false)) {
    deckTransforms$.add(deckTransforms);
    _socketGateway.onMessage.listen((value) {
      value.execute(this);
    });
  }

  Future restartGame() async {
    onRestartGame$.add(null);
  }

  Future<void> gameChanged(Game game, String topic) async {
    previousGame = game$.value;

    // Update rising edge of end turn
    if ((game.inGameProperty?.currentRound ?? 0) > playingRound) {
      playingRound = (game.inGameProperty?.currentRound ?? 0);
      allPlayerPlayedForRound = false;
    }

    // Trigger end turn
    var everyoneHadPlayed = game.players.every((element) => element.playerGameProperty?.hadPlayedTurn ?? false);
    if (everyoneHadPlayed && !allPlayerPlayedForRound) {
      _socketGateway.allPlayerPlayed();
      allPlayerPlayedForRound = true;
    }

    // ! IMPORTANT ! //
    // Topic specific actions has been moved inside socket_gateway.dart in the switch case statement
    // This return a specific object for each cases.
    // These objects can be found inside the socket_models folder.

    var chronoEnd = game.inGameProperty?.chronoUpTo;
    if(chronoEnd != null) {
      chronometer$.add(ChronometerData(chronoEnd));
    }

    lastTopic = topic;
    game$.add(game);
    lastTopic$.add(topic);
  }

  endGame() {
    gameEnded$.add(true);
    gameIsFinished = true;
  }

  startChooseCard(Player player) {
    choosingPlayer = player;
    promptChooseCard$.add(true);
  }

  void startGame() {
    _socketGateway.startGame();
  }

  void deckTransformChanged(String playerId, AppTransform transform) {
    deckTransforms[playerId] = transform;
    deckTransforms$.add(deckTransforms);
  }

  void setDeckTransforms(Map<String, AppTransform> transforms) {
    deckTransforms = transforms;
    deckTransforms$.add(deckTransforms);
  }

  List<StackCard> getStacks() {
    return game$.value.inGameProperty?.stacks ?? [];
  }

  bool isGameStarted() {
    return (game$.value.inGameProperty?.currentRound ?? 0) > 0;
  }

  bool doUserShouldChoose() {
    return game$.value.inGameProperty?.betweenRound?.currentPlayerAction?.action.type == "CHOOSE_STACK_CARD"
        && currentPlayerActionPlayer == null;
  }

  void createChronometer(ChronometerData chronometerData) {
    chronometer$.add(chronometerData);
  }

  void stopChronometer() {
    chronometer$.add(null);
  }

  void sendChoosenStack(int chosenStack) {
    _socketGateway.nextRoundResultActionChoosingStack(chosenStack);
  }

  void chooseStack(int stackNumber) {
    stackChosen$.add(stackNumber);
    promptChooseCard$.add(false);
  }
  void resetChooseStack() {
    promptChooseCard$.add(false);
  }


  Future play(PlayerActionPlayer playerActionPlayer, { Iterable<int>? usedCards }) async {
    bool isChoose = playerActionPlayer._action is ChooseStackCardPlayerAction;
    if(usedCards != null) {
      animatedCards$.add(Set<int>.from(usedCards));
    }
    var completer = Completer();
    StreamSubscription<dynamic> subscription =
        playerActionPlayer.onComplete.listen((value) => completer.complete());
    currentPlayerActionPlayer.add(playerActionPlayer);

    // Await action completion
    await completer.future;

    animatedCards$.add(<int>{});
    animationStep = 0;
    currentPlayerActionPlayer.add(null);
    subscription.cancel();
  }

  void nextAnimationStep() {
    animationStep++;
  }

  Map<String, AppTransform> getDeckTransforms() {
    return deckTransforms;
  }

  List<Player> getRank() {
    var result = game$.value.players.toList(growable: false);
    result.sort((a, b) => a.gameResult.ranking.compareTo(b.gameResult.ranking));
    return result;
  }

  void nextRound() {
    Logger.log("=====> ${lastTopic}");
    _socketGateway.nextRoundResultAction();
  }

  Map<String, PositionedPlayerDeckState> getDecks() {
    return getDecksStatic(game$.value, deckTransforms);
  }

  void resetChronometer() {}
}

class PlayerActionPlayer {
  final Player _player;
  final PlayerAction _action;

  Player get player => _player;

  Subject<dynamic> get onComplete => _action.onComplete;

  PlayerActionPlayer(this._player, this._action);

  Iterable<Widget> buildWidget(BuildContext context, SceneData sceneData) {
    return _action.buildWidget(context, sceneData, _player);
  }
}

Map<String, PositionedPlayerDeckState> getDecksStatic(
    Game game, Map<String, AppTransform> deckTransforms) {
  var gameStarted = (game.inGameProperty?.currentRound ?? 0) > 0;
  var betweenRound = game.inGameProperty?.betweenRound;

  return Map.fromEntries(game.players.map((p) {
    if (!p.isLogged && !gameStarted) {
      return MapEntry(p.id, KeyValueMap(DeckWaitPlayer(p.id), const TextPlayerDeckFooterState()));
    }

    if (p.isLogged && !gameStarted) {
      return MapEntry(p.id, KeyValueMap(DeckWaitOtherPlayers(p), const TextPlayerDeckFooterState()));
    }

    if (!p.isLogged && gameStarted) {
      return MapEntry(p.id, KeyValueMap(DeckNoPlayer(id: p.id), UserPlayerDeckFooterState(avatar: p.avatar, username: "${p.username}")));
    }

    if (betweenRound != null) {
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

      return MapEntry(p.id, KeyValueMap(DeckPlayed(p.playerGameProperty!.playedCard!, playerOrder.first.order + 1), UserAndCattleHeadsPlayerDeckFooterState(avatar: p.avatar, username: "${p.username}", numberOfDiscardCard: p.playerGameProperty?.playerDiscard.length )));
    }

    if (p.playerGameProperty?.hadPlayedTurn ?? false) {
      return MapEntry(p.id, KeyValueMap(DeckWaitOtherPlayers(p), UserAndCattleHeadsPlayerDeckFooterState(avatar: p.avatar, username: "${p.username}", numberOfDiscardCard: p.playerGameProperty?.playerDiscard.length )));
    }

    return MapEntry(p.id, KeyValueMap(DeckPlaying(), UserAndCattleHeadsPlayerDeckFooterState(avatar: p.avatar, username: "${p.username}", numberOfDiscardCard: p.playerGameProperty?.playerDiscard.length )));

    throw "Case not handled.";
  }).map((state) =>
      MapEntry(
          state.key,
          PositionedPlayerDeckState(
              state.key, state.value.playerDeckState, deckTransforms[state.key]!, state.value.playerDeckFooterState)
      )));
}


class KeyValueMap {
  final PlayerDeckState playerDeckState;
  final PlayerDeckFooterState playerDeckFooterState;

  KeyValueMap(this.playerDeckState, this.playerDeckFooterState);
}
