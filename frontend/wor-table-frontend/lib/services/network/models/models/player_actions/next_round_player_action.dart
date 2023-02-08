import '../player_action.dart';

class NextRoundPlayerAction extends PlayerAction {
  NextRoundPlayerAction() : super(nextRound);

  NextRoundPlayerAction.fromJson(Map<String, dynamic> json) : this();

  @override
  toJson() => {
    'type': type,
  };
}