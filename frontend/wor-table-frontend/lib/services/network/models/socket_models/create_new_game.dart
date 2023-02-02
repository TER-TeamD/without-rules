import 'package:worfrontend/services/game_controller.dart';
import '../../socket_message.dart';
import '../models/game.dart';

class CreateNewGame extends SocketMessage {

  final Game receivedGame;

  CreateNewGame(this.receivedGame);

  @override
  void execute(SocketGameController controller) {
  }
}