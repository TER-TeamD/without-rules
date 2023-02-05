import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/network/models/models/game.dart';

abstract class SocketMessage {


  void execute(SocketGameController controller);
}

class GameUpdate extends SocketMessage {
  final Game receivedGame;
  final String topic;

  GameUpdate(this.receivedGame, this.topic);

  @override
  void execute(SocketGameController controller) {
    controller.gameChanged(receivedGame, topic);
  }
}
