import 'package:worfrontend/services/network/socket_message.dart';

import '../../../game_controller.dart';
import '../action/action.dart';

class NewActions extends SocketMessage {
  final String idGame;
  final List<Action> actions;

  NewActions(this.idGame, this.actions);
  NewActions.fromJson(Map<String, dynamic> json)
      : idGame = json["id_game"],
        actions = (json["actions"] as List<dynamic>)
            .map((e) => Action.fromJson(e))
            .toList();

  @override
  void execute(SocketGameController game) async {
    game.playActions(actions);
  }
}
