import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/network/network_service.dart';
import 'package:worfrontend/services/network/socket_message.dart/socket_message.dart';

import '../models/table_player.dart';
import 'network/models/http_dtos/game.dart';
import 'network/models/http_dtos/new_game_dto.dart';

abstract class TableService {
  abstract List<TablePlayer>? players;
  Future<NewGameDto> createGame();
  Future<Game> startGame();
  StreamSubscription<SocketMessage> listen<T extends TableSocketMessage>(
      void Function(T message) callback);
  void setPlayerPosition(String id, Offset position);
  void unsetPlayerPosition(String id);
}

class TableServiceImplementation implements TableService {
  final NetworkService _network;
  String? gameId;
  Game? game;
  Map<String, Offset> playerPositions = <String, Offset>{};
  @override
  List<TablePlayer>? players = List.empty(growable: true);

  TableServiceImplementation(this._network);

  @override
  setPlayerPosition(String id, Offset position) {
    playerPositions[id] = position;
  }

  @override
  Future<NewGameDto> createGame() async {
    var game = await _network.createGame();
    gameId = game.idGame;
    return game;
  }

  @override
  Future<Game> startGame() async {
    game = await _network.startGame();
    players = game!.players
        .map((e) => TablePlayer(e, playerPositions[e.id] ?? Offset.zero))
        .toList();
    return game!;
  }

  @override
  StreamSubscription<SocketMessage> listen<T extends TableSocketMessage>(
      void Function(T message) callback) {
    return _network.listenOfType<T>("table", (message) {
      if (message.idGame == gameId) {
        callback(message);
      }
    });
  }

  @override
  void unsetPlayerPosition(String id) {
    playerPositions.remove(id);
  }
}
