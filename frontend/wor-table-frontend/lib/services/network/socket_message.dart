import 'package:worfrontend/services/game_controller.dart';

abstract class SocketMessage {
  void execute(SocketGameController game);
}
