import 'package:worfrontend/services/game_controller.dart';

import 'game_update.dart';

class PlayerResultActionMessage extends GameUpdate {
  PlayerResultActionMessage(super.receivedGame, super.topic);

  @override
  void execute(GameController controller) {
    super.execute(controller);

    if(controller.gameIsFinished) return;
    var playerAction = receivedGame.inGameProperty?.betweenRound?.currentPlayerAction;
    if(playerAction == null) return;

    playerAction.action.startAnimation(controller, playerAction.player);
  }
}