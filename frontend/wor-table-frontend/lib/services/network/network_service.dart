import 'dart:async';
import 'dart:convert';

import 'package:rxdart/rxdart.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:http/http.dart' as http;
import 'package:worfrontend/errors/network_uninitialized.dart';
import 'package:worfrontend/services/network/models/game.dart';
import 'package:worfrontend/services/network/models/new_game_dto.dart';
import 'socket_message.dart/socket_message.dart';

class NetworkService {
  final String hostname;
  Socket? _socket;
  final BehaviorSubject<SocketMessage> _onEvent = BehaviorSubject();

  NetworkService(this.hostname);

  Future connect() async {
    _socket = io(hostname);
  }

  StreamSubscription<SocketMessage> listen(
      String topic, void Function(SocketMessage message) callback) {
    if (_socket == null) throw NetworkUninitialized();
    _socket!
        .on(topic, (data) => _onEvent.add(SocketMessage.create(topic, data)));
    return _onEvent.listen((value) {
      if (value.topic == topic) callback(value);
    });
  }

  StreamSubscription<SocketMessage> listenOfType<T>(
      String topic, void Function(T message) callback) {
    return listen(topic, (message) {
      if (message is T) {
        callback(message as T);
      }
    });
  }

  send(String topic, dynamic value) {
    if (_socket == null) throw NetworkUninitialized();
    _socket!.emitWithAck(topic, value);
  }

  // Create a game and return possible ids for players
  Future<NewGameDto> createGame() async {
    var result = await http.post(Uri.http(hostname, "game-engine/create-game"));
    return NewGameDto.fromJson(jsonDecode(result.body));
  }

  // Start the game and return the beginning stacks
  Future<Game> startGame() async {
    var result = await http.post(Uri.http(hostname, "game-engine/start-game"));
    return Game.fromJson(jsonDecode(result.body));
  }
}
