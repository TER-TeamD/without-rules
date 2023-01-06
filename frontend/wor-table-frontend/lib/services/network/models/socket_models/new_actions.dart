import 'package:worfrontend/services/network/socket_message.dart';

import '../../../game_controller.dart';
import '../action/action.dart';
import 'message_types.dart';

class NewActions extends SocketMessage {
  @override
  String topic;

  final String idGame;
  final List<Action> actions;

  NewActions(this.topic, this.type, this.idGame, this.actions);
  NewActions.fromJson(this.topic, this.type, Map<String, dynamic> json)
      : idGame = json["id_game"],
        actions = (json["actions"] as List<dynamic>)
            .map((e) => Action.fromJson(e))
            .toList();

  @override
  SocketMessageTypes type;

  @override
  void execute(GameController game) async {
    game.playActions(actions);
  }
}
