import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/animations/add_card_and_get_stack_content.dart';
import 'package:worfrontend/components/animations/slide_card.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/models/transform.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/models/player.dart';
import '../player_action.dart';

class ChooseStackCardPlayerAction extends PlayerAction {
  int? choosenStackCardByPlayer;

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
  void startAnimation(GameController controller, Player player) {
    StreamSubscription<int>? subscription;
    subscription = controller.stackChosen$.listen((stackNumber) {
      choosenStackCardByPlayer = stackNumber;
      afterAnimation(controller, player);
      subscription?.cancel();
    });
    controller.startChooseCard(player);
    controller.stopChronometer();
  }

  @override
  void afterAnimation(GameController controller, Player player) {
    controller.sendChoosenStack(choosenStackCardByPlayer!);
  }

  @override
  Iterable<Widget> buildWidget(
      BuildContext context, SceneData sceneData, Player player) {
    var playedCard = player.playerGameProperty!.playedCard!;

    return [
      AddCardAndGetStackContent(
          id: playedCard.value.toString(),
          sceneData: sceneData,
          stackNumber: choosenStackCardByPlayer!,
          card: playedCard,
          playerId: player.id,
          onDone: () => onComplete.add(null))
    ];
  }
}
