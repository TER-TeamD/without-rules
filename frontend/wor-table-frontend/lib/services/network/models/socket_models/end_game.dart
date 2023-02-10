import 'package:worfrontend/services/game_controller.dart';
import 'game_update.dart';

class EndGameMessage extends GameUpdate {
  EndGameMessage(super.receivedGame, super.topic);

  @override
  void execute(GameController controller) {
    super.execute(controller);

    // End the game
    controller.endGame();
  }
}