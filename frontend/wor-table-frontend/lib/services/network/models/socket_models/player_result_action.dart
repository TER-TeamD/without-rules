import 'package:worfrontend/services/game_controller.dart';

import 'game_update.dart';

class PlayerResultActionMessage extends GameUpdate {
  PlayerResultActionMessage(super.receivedGame, super.topic);

  @override
  void execute(GameController controller) {
    var action = receivedGame.inGameProperty!.betweenRound!.currentPlayerAction!;
    action.action.packetLifecycle(controller, receivedGame, () => super.execute(controller));
  }
}
