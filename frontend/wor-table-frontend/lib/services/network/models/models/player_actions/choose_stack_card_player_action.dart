import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/models/player.dart';
import '../player_action.dart';

class ChooseStackCardPlayerAction extends PlayerAction {
  final int? choosenStackCardByPlayer;

  ChooseStackCardPlayerAction(this.choosenStackCardByPlayer)
      : super(chooseCardStack);

  ChooseStackCardPlayerAction.fromJson(Map<String, dynamic> json)
      : this(json['choosen_stack_card_by_player']);

  @override
  toJson() => {
    'type': type,
    'choosen_stack_card_by_player': choosenStackCardByPlayer,
  };

  @override
  void afterAnimation(GameController controller, Player player) {
    controller.chooseStack(1);
  }
}