import 'package:worfrontend/errors/app_error.dart';

class PlayerNotFound extends AppError {
  final String playerId;

  PlayerNotFound(this.playerId);

  @override
  String screenMessage() {
    return "Player $playerId not found.";
  }
}
