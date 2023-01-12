import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/components/player_deck/states/no_player.dart';
import 'package:worfrontend/components/player_deck/states/player_added.dart';
import 'package:worfrontend/components/player_deck/states/playing.dart';
import 'package:worfrontend/components/player_deck/states/wait_other_players.dart';
import 'package:worfrontend/errors/app_error.dart';
import 'package:worfrontend/errors/incoherent_message_for_state.dart';
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/network/models/action/action_types.dart';
import 'package:worfrontend/services/network/socket_gateway.dart';
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
  final BehaviorSubject<Map<String, PlayerDeckState>> decks$ =
      BehaviorSubject.seeded({});
  final BehaviorSubject<List<StackCard>> stacks$ = BehaviorSubject.seeded([]);
  final BehaviorSubject<GameStates> state$ =
      BehaviorSubject.seeded(GameStates.waitServer);

  final List<String> players = [];

  set decks(Map<String, PlayerDeckState> decks) {
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

  Map<String, PlayerDeckState> get decks => decks$.value;

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
    run(() {
      checkState(GameStates.waitServer);
      _game.decks = {for (var e in potentialPlayers) e: DeckNoPlayer(id: e)};
      _game.state = GameStates.waitPlayers;
    });
  }

  void playerJoined(String playerId) {
    run(() {
      checkState(GameStates.waitPlayers);
      _game.decks = {
        ..._game.decks,
        playerId: DeckPlayerAdded(),
      };

      _game.players.add(playerId);
    });
  }

  void initiateGame(List<StackCard> stacks) {
    run(() {
      checkState(GameStates.waitPlayers);
      _game.stacks = stacks;
      _game.state = GameStates.playing;
      _game.decks = {
        for (var e in _game.players) e: DeckPlaying(),
      };
    });
  }

  void playerPlayCard(String playerId, Card playedCard) {
    print("Player play card: $playerId");
    run(() {
      checkState(GameStates.playing);
      _game.decks[playerId] = DeckWaitOtherPlayers();
      _game.decks$.add(_game.decks);
    });
  }

  void playActions(List<Action> actions) {
    print("${actions.length} new actions.");

    for(var action in actions) {
      if(action.type == ActionTypes.pushOnTop) {
        _game.stacks[action.stack.stackNumber] = action.stack;
      }
    }

    _game.stacks$.add(_game.stacks);
  }

  void nextRound() {
    print("next round.");
    run(() {
      var decks = _game.decks;
      for (var element in _game.decks.keys) {
        decks[element] = DeckPlaying();
      }
      _game.decks = decks;
    });
  }

  void showResult(List<Result> results) {
    _game.state = GameStates.finalPhase;
  }
}

class TableGameController {
  final _State _game;
  final SocketGateway _socket;

  Map<String, PlayerDeckState> get decks => _game.decks;

  List<StackCard> get stacks => _game.stacks;

  GameStates get state => _game.state;

  BehaviorSubject<Map<String, PlayerDeckState>> get decks$ => _game.decks$;

  BehaviorSubject<List<StackCard>> get stacks$ => _game.stacks$;

  BehaviorSubject<GameStates> get state$ => _game.state$;

  TableGameController(this._game, this._socket);

  chooseCard(Card card) {}

  startGame() {
    _socket.emit("table_start_game", {});
  }

  createGame() {
    print("Creating game...");
    _socket.emit("table_create_game", {});
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
