import 'dart:collection';

import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/components/player_deck/states/no_player.dart';
import 'package:worfrontend/components/player_deck/states/playing.dart';
import 'package:worfrontend/components/player_deck/states/wait_other_players.dart';
import 'package:worfrontend/components/player_deck/states/wait_player.dart';
import 'package:worfrontend/errors/app_error.dart';
import 'package:worfrontend/errors/incoherent_message_for_state.dart';
import 'package:worfrontend/errors/player_not_found.dart';
import 'package:worfrontend/models/animations.dart';
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/network/socket_gateway.dart';
import 'package:worfrontend/services/screen_service.dart';

import 'network/models/action/action.dart';
import 'network/models/card.dart';
import 'network/models/socket_models/result.dart';
import 'network/models/stack_card.dart';

enum GameStates {
  waitServer,
  waitPlayers,
  playing,
  animatingCards,
  choosingCard,
  finalPhase,
}

class _State {
  final BehaviorSubject<List<PositionedPlayerDeckState>> decks$ =
      BehaviorSubject.seeded([]);
  final BehaviorSubject<List<StackCard>> stacks$ = BehaviorSubject.seeded([]);
  final BehaviorSubject<GameStates> state$ =
      BehaviorSubject.seeded(GameStates.waitServer);
  final BehaviorSubject<GameAnimation?> currentAnimation$ = BehaviorSubject.seeded(null);

  Map<String, GameCard> playedCards = {};
  final animations$ = BehaviorSubject.seeded(Queue<GameAnimation>());

  final List<String> players = [];

  set decks(List<PositionedPlayerDeckState> decks) {
    Logger.log("Setting deck");
    decks$.add(decks);
  }

  set stacks(List<StackCard> stacks) {
    Logger.log("Setting stacks");
    stacks$.add(stacks);
  }

  set state(GameStates state) {
    Logger.log("Setting state");
    state$.add(state);
  }

  set currentAnimation(GameAnimation? animation) {
    Logger.log("Setting animation");
    currentAnimation$.add(animation);
  }


  PositionedPlayerDeckState getPlayerDeckState(String playerId) {
    return decks.singleWhere((element) => element.playerId == playerId,
        orElse: () => throw PlayerNotFound(playerId));
  }

  void changePlayerDeckState(String playerId, PlayerDeckState newState) {
    var deck = getPlayerDeckState(playerId);
    deck.state = newState;
    decks$.add(decks);
  }

  void changeAllDeckState(
      PlayerDeckState Function(PositionedPlayerDeckState) builder) {
    decks = decks.map((e) {
      e.state = builder(e);
      return e;
    }).toList(growable: false);
  }

  pushAnimation(GameAnimation animation) {
    if(currentAnimation == null) {
      currentAnimation = animation;
    } else {
      animations$.value.add(animation);
      animations$.add(animations$.value);
    }
  }

  List<PositionedPlayerDeckState> get decks => decks$.value;

  List<StackCard> get stacks => stacks$.value;

  GameStates get state => state$.value;

  Queue<GameAnimation> get animations => animations$.value;

  GameAnimation? get currentAnimation => currentAnimation$.value;

}

class SocketGameController {
  final _State _game;

  SocketGameController(this._game);

  run(void Function() callback) {
    try {
      callback();
    } on AppError catch (e) {
      GetIt.I.get<ErrorManager>().throwError(e);
    }
  }

  checkState(GameStates state) {
    if (_game.state != state) {
      throw UnexpectedState(state.name, _game.state.name);
    }
  }

  void gameCreated(List<String> potentialPlayers) {
    var screenService = GetIt.I.get<ScreenService>();
    var positions = screenService.getPositions();
    run(() {
      checkState(GameStates.waitServer);
      _game.decks = Iterable.generate(potentialPlayers.length)
          .map((i) => PositionedPlayerDeckState(potentialPlayers[i],
              DeckNoPlayer(id: potentialPlayers[i]), positions[i]))
          .toList(growable: false);
      // _game.decks = {for (var e in potentialPlayers) e: DeckNoPlayer(id: e)};
      _game.state = GameStates.waitPlayers;
    });
  }

  void playerJoined(String playerId) {
    run(() {
      checkState(GameStates.waitPlayers);

      _game.changePlayerDeckState(playerId, DeckWaitPlayer(playerId));

      _game.players.add(playerId);
    });
  }

  void initiateGame(List<StackCard> stacks) {
    run(() {
      checkState(GameStates.waitPlayers);
      _game.stacks = stacks;
      _game.state = GameStates.playing;
      _game.changeAllDeckState((_) => DeckPlaying());
    });
  }

  void playerPlayCard(String playerId, GameCard playedCard) {
    Logger.log("Player play card: $playerId");
    run(() {
      checkState(GameStates.playing);
      _game.playedCards[playerId] = playedCard;
      _game.changePlayerDeckState(playerId, DeckWaitOtherPlayers());
      _game.decks$.add(_game.decks);
    });
  }

  void playActions(List<Action> actions) {
    Logger.log("${actions.length} new actions.");

    for (var action in actions) {
      // if (action.type == ActionTypes.pushOnTop) {
      //   _game.stacks[action.stack.stackNumber] = action.stack;
      // }
      // _game.animations.add(action);

      _game.pushAnimation(PushOnTopAnimationData(_game.playedCards[action.playerId]!, _game.stacks.singleWhere((element) => element.stackNumber == action.stack.stackNumber), action.playerId, GameAnimations.pushOnTop));
    }

    // _game.stacks$.add(_game.stacks);
  }

  void nextRound() {
    Logger.log("next round.");
    run(() {
      _game.changeAllDeckState((_) => DeckPlaying());
    });
  }

  void showResult(List<Result> results) {
    _game.state = GameStates.finalPhase;
  }
}

class TableGameController {
  final _State _game;
  final SocketGateway _socket;

  List<PositionedPlayerDeckState> get decks => _game.decks;

  List<StackCard> get stacks => _game.stacks;

  GameStates get state => _game.state;
  Queue<GameAnimation> get animations => _game.animations;

  BehaviorSubject<List<PositionedPlayerDeckState>> get decks$ => _game.decks$;

  BehaviorSubject<List<StackCard>> get stacks$ => _game.stacks$;

  BehaviorSubject<GameStates> get state$ => _game.state$;
  BehaviorSubject<Queue<GameAnimation>> get animations$ => _game.animations$;

  BehaviorSubject<GameAnimation?> get currentAnimation$ => _game.currentAnimation$;


  TableGameController(this._game, this._socket);

  chooseCard(GameCard card) {}

  startGame() {
    _socket.emit("table_start_game", {});
  }

  createGame() {
    Logger.log("Creating game...");
    _socket.emit("table_create_game", {});
  }

  PositionedPlayerDeckState getPlayerDeckState(playerId) {
    return _game.getPlayerDeckState(playerId);
  }

  pushOnTop(StackCard stack, GameCard card, String playerId) {
    var newStack = StackCard(stack.stackNumber, card, [...stack.stackCards, card]);

    _game.stacks = [..._game.stacks.where((element) => element.stackNumber != stack.stackNumber), newStack]..sort((a, b) => a.stackNumber.compareTo(b.stackNumber));
  }

  animationComplete(GameAnimation animation) {
    if(animation is PushOnTopAnimationData) {
      pushOnTop(animation.stack, animation.card, animation.playerId);
    }

    if(_game.animations.isNotEmpty) {
      _game.currentAnimation = _game.animations.removeFirst();
    } else {
      _game.currentAnimation = null;
    }
  }
}

class GameControllers {
  final TableGameController tableGameController;
  final SocketGameController socketGameController;

  const GameControllers(this.tableGameController, this.socketGameController);

  static GameControllers create(SocketGateway socketGateway) {
    var game = _State();
    var socketGameController = SocketGameController(game);
    var gameController = TableGameController(game, socketGateway);

    socketGateway.onMessage.listen((value) {
      value.execute(socketGameController);
    });
    socketGateway.connected.listen((value) {
      gameController.createGame();
    });

    return GameControllers(gameController, socketGameController);
  }
}
