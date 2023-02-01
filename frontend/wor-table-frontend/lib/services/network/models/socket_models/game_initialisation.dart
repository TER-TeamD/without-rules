import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/network/socket_message.dart';

class GameInitialisation extends SocketMessage {
  final List<String> potentialPlayers;

  GameInitialisation.fromJson(Map<String, dynamic> json)
      : potentialPlayers = List<String>.from(json["potential_players_id"]);

  @override
  void execute(SocketGameController game) {
    Logger.space();
    Logger.log(">>> PlayerIds: [${potentialPlayers.join(", ")}]");
    Logger.space();
    game.gameCreated(potentialPlayers);
  }
}
