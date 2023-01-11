import 'package:worfrontend/services/network/socket_message.dart';

import '../../../game_controller.dart';

class PlayerJoined extends SocketMessage {

  String playerId;

  PlayerJoined.fromJson(Map<String, dynamic> json)
      : playerId = json["playerId"];

  @override
  Future execute(SocketGameController game) async {
    game.playerJoined(playerId);
  }
}
