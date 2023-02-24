import 'dart:async';
import 'dart:convert';

import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:worfrontend/errors/server_error.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/network/models/models/game.dart';
import 'package:worfrontend/services/network/socket_message.dart';
import 'package:worfrontend/services/network/socket_topics.dart';

import '../error_manager.dart';

import 'models/socket_models/end_game.dart';
import 'models/socket_models/game_update.dart';
import 'models/socket_models/player_result_action.dart';

class SocketGateway {
  final Socket socket;
  final Subject<SocketMessage> onMessage;
  final Subject connected = BehaviorSubject();

  final Subject<MapEntry<String, dynamic>> onAny$ = PublishSubject();

  SocketGateway(this.socket) : onMessage = PublishSubject();

  listenEvents() {
    socket.onConnect((data) {
      Logger.log("Connected");
      connected.add(true);
    });
    socket.onAny((String topic, data) {
      onAny$.add(MapEntry<String, dynamic>(topic, data));
      if (topic == "disconnect") return;

      if (data != null && data['game'] is Map<String, dynamic>) {
        var game = _decodeJson(data);
        Logger.log("Received $topic: ${jsonEncode(game.toJson())}");
        Logger.log(game.players.map((e) => e.id).toString());

        switch (topic) {
          case gameCreated:
            break;
          case newAction:
            onMessage.add(PlayerResultActionMessage(game, topic));
            break;
          case endGame:
            onMessage.add(EndGameMessage(game, topic));
            break;
          default:
            onMessage.add(GameUpdate(game, topic));
            break;
        }
      }
    });

    socket.on('exception', (data) {
      GetIt.I.get<ErrorManager>().throwError(ServerError(500, data["message"]));
    });
  }

  Game _decodeJson(Map<String, dynamic> json) {
    try {
      return Game.fromJson(json['game']);
    } catch (e) {
      Logger.log("Error decoding json: $e");
      Logger.log(jsonEncode(json));
      rethrow;
    }
  }

  Future<Game> newGame() async {
    var event = "TABLE_NEW_GAME";
    var completer = Completer<Game>();
    socket.once(socketTopicsToString(SocketTopics.createNewGame), (data) {
      var game = _decodeJson(data);
      completer.complete(game);
    });
    emit(event, {});

    return completer.future;
  }

  void startGame() {
    var event = "TABLE_START_GAME";
    emit(event, {});
  }

  void allPlayerPlayed() {
    var event = "TABLE_ALL_PLAYER_PLAYED";
    emit(event, {});
  }

  void nextRoundResultAction() {
    var event = "TABLE_NEXT_ROUND_RESULT_ACTION";
    emit(event, {'choosen_stack': null});
  }

  void nextRoundResultActionChoosingStack(int stackNumber) {
    var event = "TABLE_NEXT_ROUND_RESULT_ACTION";
    emit(event, {'choosen_stack': stackNumber});
  }

  void newResultAction() {
    var event = "NEW_RESULT_ACTION";
    emit(event, {});
  }

  void emit(String topic, dynamic data) {
    Logger.log("Emitting $topic: $data");
    socket.emit(topic, data);
  }
}
