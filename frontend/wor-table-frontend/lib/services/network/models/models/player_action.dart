import 'package:flutter/cupertino.dart';
import 'package:rxdart/rxdart.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/services/network/models/models/player.dart';

const String sendCardToStack = "SEND_CARD_TO_STACK";
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
    this.onComplete.add(null);
  }

  Iterable<Widget> buildWidget(
      BuildContext context, SceneData sceneData, Player player) {
    return [];
  }

  toJson();
}

class SendCardToStackPlayerAction extends PlayerAction {
  final int stackNumber;

  SendCardToStackPlayerAction(this.stackNumber) : super(sendCardToStack);

  SendCardToStackPlayerAction.fromJson(Map<String, dynamic> json)
      : this(json['stack_number']);

  @override
  toJson() => {
        'type': type,
        'stack_number': stackNumber,
      };
}

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
}

class ChooseStackCardPlayerAction extends PlayerAction {
  final int choosenStackCardByPlayer;

  ChooseStackCardPlayerAction(this.choosenStackCardByPlayer)
      : super(chooseCardStack);

  ChooseStackCardPlayerAction.fromJson(Map<String, dynamic> json)
      : this(json['choosen_stack_card_by_player']);

  @override
  toJson() => {
        'type': type,
        'choosen_stack_card_by_player': choosenStackCardByPlayer,
      };
}

class NextRoundPlayerAction extends PlayerAction {
  NextRoundPlayerAction() : super(nextRound);

  NextRoundPlayerAction.fromJson(Map<String, dynamic> json) : this();

  @override
  toJson() => {
        'type': type,
      };
}
