import 'package:worfrontend/services/game_controller.dart';

import 'game_update.dart';

class PlayerResultActionMessage extends GameUpdate {
  PlayerResultActionMessage(super.receivedGame, super.topic);

  @override
  void execute(GameController controller) {
    /*
    Game Change notification is delayed to the action because the send_to_stack_to_player_discard action destroy the stack
    Whom are needed for the animation.
     */

    var action = receivedGame.inGameProperty!.betweenRound!.currentPlayerAction!;
    action.action.packetLifecycle(controller, receivedGame, () => super.execute(controller));
  }
}
