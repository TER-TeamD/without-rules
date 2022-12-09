import 'dart:ui';

import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/models/table_player.dart';
import 'package:worfrontend/services/network/models/action/action.dart';
import 'package:worfrontend/services/network/models/action/action_types.dart';
import 'package:worfrontend/services/network/models/card.dart';
import 'package:worfrontend/services/network/models/socket_models/card_played_by_user.dart';
import 'package:worfrontend/services/network/models/socket_models/message_types.dart';
import 'package:worfrontend/services/network/models/socket_models/new_actions.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';
import 'package:worfrontend/services/network/socket_message.dart/socket_message.dart';
import 'dart:async';

import 'package:worfrontend/services/table_service.dart';

import 'network/models/http_dtos/game.dart';
import 'network/models/http_dtos/in_game_property.dart';
import 'network/models/http_dtos/new_game_dto.dart';
import 'network/models/http_dtos/player.dart';

class TableServiceMock implements TableService {
  Map<String, Offset> playersPosition = {};

  final BehaviorSubject<TableSocketMessage> _messages = BehaviorSubject();

  @override
  Future<NewGameDto> createGame() async {
    return NewGameDto("idGame", ["id1", "id2"]);
  }

  @override
  StreamSubscription<SocketMessage> listen<T extends TableSocketMessage>(
      void Function(T message) callback) {
    return _messages.listen((value) {
      if (value is T) callback(value);
    });
  }

  @override
  Future<Game> startGame() async {
    var mockedPlayers = [
      Player("id1", true, [], null),
      Player("id2", true, [], null)
    ];

    simulateGame();

    return Game(
        mockedPlayers,
        InGameProperty([], [
          StackCard(1, Card(1, 1), [Card(1, 1)]),
          StackCard(1, Card(2, 1), [Card(2, 1)]),
          StackCard(1, Card(3, 1), [Card(3, 1)]),
          StackCard(1, Card(5, 1), [Card(4, 1)])
        ]));
  }

  void simulateGame() {
    Future.delayed(const Duration(seconds: 5)).then((_) {
      _messages.add(CardPlayedByUser("table",
          SocketMessageTypes.cardPlayedByUser, "idGame", "id1", Card(6, 1)));
    });
    Future.delayed(const Duration(seconds: 6)).then((_) {
      _messages.add(CardPlayedByUser("table",
          SocketMessageTypes.cardPlayedByUser, "idGame", "id2", Card(6, 1)));

      _messages.add(
          NewActions("newAction", SocketMessageTypes.newActions, "idGame", [
        Action(ActionTypes.pushOnTop, "id1",
            StackCard(3, Card(6, 1), [Card(5, 1), Card(6, 1)])),
        Action(ActionTypes.clearPush, "id2",
            StackCard(3, Card(6, 1), [Card(6, 1)]))
      ]));
      Future.delayed(const Duration(seconds: 10)).then((_) => simulateGame());
    });
  }

  @override
  List<TablePlayer>? players;

  @override
  void setPlayerPosition(String id, Offset position) {
    playersPosition[id] = position;
  }

  @override
  void unsetPlayerPosition(String id) {
    playersPosition.remove(id);
  }
}
