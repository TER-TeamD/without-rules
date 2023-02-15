import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/animations/slide_card.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/models/transform.dart';

import '../../../../game_controller.dart';
import '../player.dart';
import '../player_action.dart';

import 'dart:math';

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

  @override
  void startAnimation(GameController controller, Player player) {
    //afterAnimation(controller, player);
    controller.play(PlayerActionPlayer(player, this), usedCards: [player.playerGameProperty!.playedCard!.value])
        .then((_) => afterAnimation(controller, player));
  }

  @override
  Iterable<Widget> buildWidget(BuildContext context, SceneData sceneData, Player player) {
    var playedCard = player.playerGameProperty!.playedCard!;


    return [
      SlideCard(id: playedCard.value.toString(), retrieveData: () {
        var fromTransform = sceneData.decks[player.id]!;
        var renderBox = sceneData.stacks[stackNumber].followingCardHolder()?.currentContext?.findRenderObject() as RenderBox?;
        var toPosition = renderBox?.localToGlobal(Offset.zero);

        var playedCard = player.playerGameProperty!.playedCard!;
        return SlideCardData(from: fromTransform, to: AppTransform(toPosition ?? Offset.zero, 0), child: CardComponent(card: playedCard, isStackHead: false));
      }, onDone: () => onComplete.add(null))
    ];
  }
}
