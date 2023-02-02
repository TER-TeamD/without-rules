import 'package:worfrontend/services/network/models/models/player.dart';
import 'package:worfrontend/services/network/models/models/player_action.dart';
import 'package:worfrontend/services/network/models/models/player_flip_order.dart';

class BetweenRound {
  final BetweenRoundPlayerAction? currentPlayerAction;
  final int indexCurrentPlayerActionInPlayerOrder;
  final List<PlayerFlipOrder> playerOrder;

  BetweenRound(this.currentPlayerAction, this.indexCurrentPlayerActionInPlayerOrder, this.playerOrder);
  BetweenRound.fromJson(Map<String, dynamic> json) :
      currentPlayerAction = json['current_player_action'] == null
          ? null
          : BetweenRoundPlayerAction.fromJson(json['current_player_action']),
      indexCurrentPlayerActionInPlayerOrder = json['index_current_player_action_in_player_order'],
      playerOrder = (json['playerOrder'] as List<Map<String, dynamic>>)
          .map((e) => PlayerFlipOrder.fromJson(e)).toList(growable: false);
}

class BetweenRoundPlayerAction {
  final Player player;
  final PlayerAction action;

  BetweenRoundPlayerAction(this.player, this.action);
  BetweenRoundPlayerAction.fromJson(Map<String, dynamic> json)
      : player = Player.fromJson(json["player"]),
        action = PlayerAction.fromJson(json["action"]);
}