import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/socket_models/message_types.dart';

import '../../socket_message.dart';

class NextRound extends SocketMessage {
  @override
  String topic;

  @override
  SocketMessageTypes type;

  @override
  String idGame;

  NextRound(this.topic, this.idGame) : type = SocketMessageTypes.nextRound;
  NextRound.fromJson(this.topic, Map<String, dynamic> json)
      : idGame = json["id_game"],
        type = SocketMessageTypes.nextRound;

  @override
  void execute(GameController game) {
    game.nextRound();
  }
}
