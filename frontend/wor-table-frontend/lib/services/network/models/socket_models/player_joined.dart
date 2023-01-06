import 'package:worfrontend/services/network/models/socket_models/message_types.dart';
import 'package:worfrontend/services/network/models/http_dtos/game.dart';
import 'package:worfrontend/services/network/socket_message.dart';

import '../../../game_controller.dart';

class PlayerJoined extends SocketMessage {
  @override
  String topic;

  @override
  SocketMessageTypes type;

  String playerId;

  PlayerJoined.fromJson(this.topic, Map<String, dynamic> json)
      : type = SocketMessageTypes.playerJoined,
        playerId = json["playerId"];

  @override
  Future execute(GameController game) async {
    game.playerJoined(playerId);
  }
}
