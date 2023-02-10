import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/models/player.dart';
import '../player_action.dart';

class NextRoundPlayerAction extends PlayerAction {
  NextRoundPlayerAction() : super(nextRound);

  NextRoundPlayerAction.fromJson(Map<String, dynamic> json) : this();

  @override
  toJson() => {
    'type': type,
  };

  @override
  void afterAnimation(GameController controller, Player player) {
  }
}