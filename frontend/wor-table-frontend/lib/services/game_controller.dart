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
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/network/models/action/action_types.dart';
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

  Map<String, GameCard> playedCards = {};
  final animations = Queue<Action>();

  final List<String> players = [];

  set decks(List<PositionedPlayerDeckState> decks) {
    print("Setting deck");
    decks$.add(decks);
  }

  set stacks(List<StackCard> stacks) {
    print("Setting stacks");
    stacks$.add(stacks);
  }

  set state(GameStates state) {
    print("Setting state");
    state$.add(state);
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

  List<PositionedPlayerDeckState> get decks => decks$.value;

  List<StackCard> get stacks => stacks$.value;

  GameStates get state => state$.value;
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
    print("Player play card: $playerId");
    run(() {
      checkState(GameStates.playing);
      _game.playedCards[playerId] = playedCard;
      _game.changePlayerDeckState(playerId, DeckWaitOtherPlayers());
      _game.decks$.add(_game.decks);
    });
  }

  void playActions(List<Action> actions) {
    print("${actions.length} new actions.");

    for (var action in actions) {
      if(action.type == ActionTypes.pushOnTop) {
        _game.stacks[action.stack.stackNumber] = action.stack;
      }
      // _game.animations.add(action);
    }

    _game.stacks$.add(_game.stacks);
  }

  void nextRound() {
    print("next round.");
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

  BehaviorSubject<List<PositionedPlayerDeckState>> get decks$ => _game.decks$;

  BehaviorSubject<List<StackCard>> get stacks$ => _game.stacks$;

  BehaviorSubject<GameStates> get state$ => _game.state$;

  TableGameController(this._game, this._socket);

  chooseCard(GameCard card) {}

  startGame() {
    _socket.emit("table_start_game", {});
  }

  createGame() {
    print("Creating game...");
    _socket.emit("table_create_game", {});
  }

  PositionedPlayerDeckState getPlayerDeckState(playerId) {
    return _game.getPlayerDeckState(playerId);
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
