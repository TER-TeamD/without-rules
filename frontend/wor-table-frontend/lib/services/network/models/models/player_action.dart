import 'package:flutter/cupertino.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/chronometer_data.dart';
import 'package:worfrontend/services/network/models/models/game.dart';
import 'package:worfrontend/services/network/models/models/player.dart';
import 'package:worfrontend/services/network/models/models/player_actions/choose_stack_card_player_action.dart';
import 'package:worfrontend/services/network/models/models/player_actions/next_round_player_action.dart';
import 'package:worfrontend/services/network/models/models/player_actions/send_card_to_stack_and_add_cards_to_player_discard_player_action.dart';
import 'package:worfrontend/services/network/models/models/player_actions/send_card_to_stack_player_action.dart';

const String sendCardToStack = "SEND_CARD_TO_STACK_CARD";
const String sendCardToStackAndAddCardToPlayerDiscard =
    "SEND_CARD_TO_STACK_CARD_AND_ADD_CARD_TO_PLAYER_DISCARD";
const String chooseCardStack = "CHOOSE_STACK_CARD";
const String nextRound = "NEXT_ROUND";

abstract class PlayerAction {
  final String type;
  final Subject onComplete;

  PlayerAction(this.type) : onComplete = PublishSubject();

  static PlayerAction fromJson(Map<String, dynamic> json) {
    String type = json["type"];
    switch (type) {
      case sendCardToStack:
        return SendCardToStackPlayerAction.fromJson(json);
      case sendCardToStackAndAddCardToPlayerDiscard:
        return SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction
            .fromJson(json);
      case chooseCardStack:
        return ChooseStackCardPlayerAction.fromJson(json);
      case nextRound:
        return NextRoundPlayerAction.fromJson(json);
      default:
        throw Exception("Unknown player action type: $type");
    }
  }

  setComplete() {
    onComplete.add(null);
  }

  Iterable<Widget> buildWidget(
      BuildContext context, SceneData sceneData, Player player) {
    return [];
  }

  toJson();

  void packetLifecycle(GameController controller, Game receivedGame,
      void Function() packetExecution) {
    if (controller.gameIsFinished) return;

    controller.resetChooseStack();

    var endChrono = receivedGame.inGameProperty?.chronoUpTo;
    if (endChrono != null) {
      controller.createChronometer(ChronometerData(endChrono));
    } else {
      controller.stopChronometer();
    }

    executeAction(
        controller,
        receivedGame,
        receivedGame.inGameProperty!.betweenRound!.currentPlayerAction!.player,
        packetExecution);
  }

  void executeAction(GameController controller, Game receivedGame,
      Player player, void Function() packetExecution) {
    packetExecution();
    controller.stopChronometer();
    startAnimation(controller, player);
  }

  void startAnimation(GameController controller, Player player) {
    afterAnimation(controller, player);
  }

  void afterAnimation(GameController controller, Player player) {
    controller.nextRound();
  }
}
