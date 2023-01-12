import 'package:worfrontend/services/game_controller.dart';

import '../../socket_message.dart';

class NextRound extends SocketMessage {

  NextRound();
  NextRound.fromJson(Map<String, dynamic> json);

  @override
  void execute(SocketGameController game) {
    game.nextRound();
  }
}
