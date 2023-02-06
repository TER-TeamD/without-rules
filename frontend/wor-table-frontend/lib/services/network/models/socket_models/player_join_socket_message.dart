
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/models/game.dart';

import '../../socket_message.dart';

class PlayerJoinSocketMessage extends SocketMessage {
  final Game receivedGame;

  PlayerJoinSocketMessage(this.receivedGame);

  @override
  void execute(SocketGameController controller) {
  }
}
