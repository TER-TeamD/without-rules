import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/animations/add_card_and_get_stack_content.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/models/player.dart';

import '../game.dart';
import '../player_action.dart';

class SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction
    extends PlayerAction {
  final int stackNumber;

  SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction(this.stackNumber)
      : super(sendCardToStackAndAddCardToPlayerDiscard);

  SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction.fromJson(
      Map<String, dynamic> json)
      : this(json['stack_number']);

  @override
  toJson() => {
        'type': type,
        'stack_number': stackNumber,
      };

  @override
  void executeAction(GameController controller, Game receivedGame, Player player, void Function() packetExecution) {
    onComplete.listen((_) {
      packetExecution();
    });
    startAnimation(controller, player);
  }

  @override
  void startAnimation(GameController controller, Player player) {
    controller.play(PlayerActionPlayer(player, this), usedCards: [
      ...controller.previousGame!.inGameProperty!.stacks[stackNumber]
          .getCards()
          .map((e) => e.value),
      player.playerGameProperty!.playedCard!.value
    ]).then((_) => afterAnimation(controller, player));
  }

  @override
  void afterAnimation(GameController controller, Player player) {
    controller.nextRound();
  }

  @override
  Iterable<Widget> buildWidget(
      BuildContext context, SceneData sceneData, Player player) {
    var playedCard = player.playerGameProperty!.playedCard!;

    return [
      AddCardAndGetStackContent(
          id: playedCard.value.toString(),
          sceneData: sceneData,
          stackNumber: stackNumber!,
          card: playedCard,
          playerId: player.id,
          onDone: () => onComplete.add(null))
    ];
  }
}
