import 'package:worfrontend/services/game_controller.dart';
import '../../socket_message.dart';
import '../models/game.dart';

class CreateNewGameSocketMessage extends SocketMessage {

  final Game receivedGame;

  CreateNewGameSocketMessage(this.receivedGame);

  @override
  void execute(SocketGameController controller) {
  }
}
