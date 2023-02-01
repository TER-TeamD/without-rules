import 'dart:convert';

import 'package:get_it/get_it.dart';
import 'package:rxdart/rxdart.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:worfrontend/errors/server_error.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/network/models/socket_models/card_played_by_user.dart';
import 'package:worfrontend/services/network/models/socket_models/initiate_game.dart';
import 'package:worfrontend/services/network/models/socket_models/new_actions.dart';
import 'package:worfrontend/services/network/models/socket_models/next_round.dart';
import 'package:worfrontend/services/network/models/socket_models/player_joined.dart';
import 'package:worfrontend/services/network/models/socket_models/results.dart';
import 'package:worfrontend/services/network/socket_message.dart';
import 'package:worfrontend/services/network/socket_topics.dart';

import '../error_manager.dart';
import 'models/socket_models/game_initialisation.dart';

class SocketGateway {
  final Socket socket;
  final Subject<SocketMessage> onMessage;
  final Subject connected = BehaviorSubject();

  SocketGateway(this.socket) : onMessage = PublishSubject();

  void log(Map<String, dynamic> json) {
    Logger.log(jsonEncode(json));
  }

  listenEvents() {
    socket.onConnect((data) {
      Logger.log("Connected");
      connected.add(true);
    });
    socket.onAny((String topic, data) {
      Logger.log("Data received from $topic: $data");
    });

    socket.on('exception', (data) {
      GetIt.I.get<ErrorManager>().throwError(ServerError(500, data["message"]));
    });
    socket.on(socketTopicsToString(SocketTopics.newPlayerTopic), (data) {
      log(data);
      onMessage.add(PlayerJoined.fromJson(data));
    });
    socket.on(socketTopicsToString(SocketTopics.initiateGameTopic), (data) {
      log(data);
      onMessage.add(InitiateGame.fromJson(data));
    });
    socket.on(socketTopicsToString(SocketTopics.gameInitialisationTopic),
        (data) {
      onMessage.add(GameInitialisation.fromJson(data));
    });
    socket.on(socketTopicsToString(SocketTopics.cardPlayedTopic), (data) {
      onMessage.add(CardPlayedByUser.fromJson(data));
    });
    socket.on(socketTopicsToString(SocketTopics.newActionsTopic), (data) {
      onMessage.add(NewActions.fromJson(data));
    });
    socket.on(socketTopicsToString(SocketTopics.nextRoundTopic), (data) {
      onMessage.add(NextRound.fromJson(data));
    });
    socket.on(socketTopicsToString(SocketTopics.resultsTopic), (data) {
      onMessage.add(Results.fromJson(data));
    });
  }

  emit(String topic, dynamic data) {
    Logger.log("Emitting $topic: $data");
    socket.emit(topic, data);
  }
}
