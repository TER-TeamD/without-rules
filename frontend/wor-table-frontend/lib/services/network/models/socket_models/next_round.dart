import 'package:worfrontend/services/game_controller.dart';

import '../../socket_message.dart';

class NextRound extends SocketMessage {
  String idGame;

  NextRound(this.idGame);
  NextRound.fromJson(Map<String, dynamic> json)
      : idGame = json["id_game"];

  @override
  void execute(SocketGameController game) {
    game.nextRound();
  }
}
