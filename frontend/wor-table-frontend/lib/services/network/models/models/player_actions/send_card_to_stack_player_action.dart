import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/animations/slide_card.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/models/scene_data.dart';

import '../../../../game_controller.dart';
import '../player.dart';
import '../player_action.dart';

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