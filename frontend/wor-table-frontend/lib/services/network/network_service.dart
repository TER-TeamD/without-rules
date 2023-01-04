import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:get_it/get_it.dart';
import 'package:http/http.dart';
import 'package:rxdart/rxdart.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:http/http.dart' as http;
import 'package:worfrontend/errors/network_uninitialized.dart';
import 'package:worfrontend/errors/server_error.dart';
import 'package:worfrontend/errors/socket_error.dart';
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/network/socket_request.dart';
import 'models/http_dtos/game.dart';
import 'models/http_dtos/new_game_dto.dart';
import 'socket_message.dart/socket_message.dart';

class NetworkService {
  final String hostname;
  Socket? _socket;
  final BehaviorSubject<SocketMessage> _onEvent = BehaviorSubject();

  NetworkService(this.hostname);

  Future connect() async {
    _socket = io("ws://$hostname", <String, dynamic>{
      'auth': <String, dynamic>{'id': 0, 'type': "TABLE"}
    });
    _socket!.on('error', (data) {
      ErrorManager.handle(SocketError(data));
    });
  }

  StreamSubscription<SocketMessage> listen(
      String topic, void Function(SocketMessage message) callback) {
    if (_socket == null) throw NetworkUninitialized();

    _socket!.on(topic, (data) {
      print(data);
      _onEvent.add(SocketMessage.create(topic, data));
    });
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

  handleHttpErrors(Response response) {
    if (!response.statusCode.toString().startsWith("2")) {
      throw ServerError(response.statusCode, response.body);
    }
  }

  // Create a game and return possible ids for players
  Future<NewGameDto> createGame() async {
    if (_socket == null) throw '';
    return SocketRequest.send(
        socket: _socket!,
        requestEvent: 'table_create_game',
        responseEvent: 'player_initialization',
        responseBuilder: (data) => NewGameDto.fromJson(data));
  }

  // Start the game and return the beginning stacks
  Future<Game> startGame() async {
    if (_socket == null) throw ErrorManager.handle(NetworkUninitialized());
    return SocketRequest.send(
        socket: _socket!,
        requestEvent: 'table_start_game',
        responseEvent: 'table_cards_initialization',
        responseBuilder: (data) => Game.fromJson(data));
  }
}
