import 'package:flutter/cupertino.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/models/player.dart';
import 'package:worfrontend/services/network/models/models/player_actions/choose_stack_card_player_action.dart';
import 'package:worfrontend/services/network/models/models/player_actions/next_round_player_action.dart';
import 'package:worfrontend/services/network/models/models/player_actions/send_card_to_stack_and_add_cards_to_player_discard_player_action.dart';
import 'package:worfrontend/services/network/models/models/player_actions/send_card_to_stack_player_action.dart';

import '../../../game_controller.dart';

const String sendCardToStack = "SEND_CARD_TO_STACK_CARD";
const String sendCardToStackAndAddCardToPlayerDiscard = "SEND_CARD_TO_STACK_CARD_AND_ADD_CARD_TO_PLAYER_DISCARD";
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
        return SendCardToStackCardAndAddCardsToPlayerDiscardPlayerAction.fromJson(json);
      case chooseCardStack:
        return ChooseStackCardPlayerAction.fromJson(json);
      case nextRound:
        return NextRoundPlayerAction.fromJson(json);
      default:
        throw Exception("Unknown player action type: $type");
    }
  }

  setComplete() {
    this.onComplete.add(null);
  }

  Iterable<Widget> buildWidget(BuildContext context, SceneData sceneData, Player player) {
    return [];
  }

  toJson();

  void execute(GameController controller, Player player) {
  }
}
