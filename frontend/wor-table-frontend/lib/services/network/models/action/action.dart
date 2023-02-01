import 'package:worfrontend/services/network/models/action/action_types.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';

class Action {
  final ActionTypes type;
  final String playerId;
  final StackCard stack;

  Action(this.type, this.playerId, this.stack);

  Action.fromJson(Map<String, dynamic> json)
      : type = getActionType(json["type"]),
        playerId = json["player_id"],
        stack = StackCard.fromJson(json["stack"]);
}
