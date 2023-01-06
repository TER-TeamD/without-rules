import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/http_dtos/game.dart';
import 'package:worfrontend/services/network/models/socket_models/card_played_by_user.dart';
import 'package:worfrontend/services/network/models/socket_models/initiate_game.dart';
import 'package:worfrontend/services/network/models/socket_models/message_types.dart';
import 'package:worfrontend/services/network/models/socket_models/new_actions.dart';
import 'package:worfrontend/services/network/models/socket_models/next_round.dart';
import 'package:worfrontend/services/network/models/socket_models/player_joined.dart';
import 'package:worfrontend/services/network/models/socket_models/results.dart';

abstract class SocketMessage {
  abstract String topic;
  abstract SocketMessageTypes type;

  Future execute(GameController game);

  static SocketMessage create(String topic, Map<String, dynamic> json) {
    String typeStr = json["type"];
    var type = getSocketMessageType(typeStr);
    switch (type) {
      case SocketMessageTypes.initiateGame:
        return InitiateGame.fromJson(topic, type, json["value"]);
      case SocketMessageTypes.cardPlayedByUser:
        return CardPlayedByUser.fromJson(topic, type, json["value"]);
      case SocketMessageTypes.newActions:
        return NewActions.fromJson(topic, type, json["value"]);
      case SocketMessageTypes.results:
        return Results.fromJson(topic, type, json["value"]);
      case SocketMessageTypes.nextRound:
        return NextRound.fromJson(topic, json["value"]);
      case SocketMessageTypes.playerJoined:
        return PlayerJoined.fromJson(topic, json["value"]);
    }
    // ignore: dead_code
    throw "Type not handled.";
  }
}

abstract class TableSocketMessage extends SocketMessage {
  abstract final String idGame;
}
