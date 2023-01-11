import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/socket_message.dart';

class GameInitialisation extends SocketMessage {

  final List<String> potentialPlayers;

  GameInitialisation.fromJson(Map<String, dynamic> json)
      : potentialPlayers = List<String>.from(json["potential_players_id"]);

  @override
  void execute(SocketGameController game) {
    print("PlayerIds: \n${potentialPlayers.join("\n")}");
    game.gameCreated(potentialPlayers);
  }
}
