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

  @override
  void execute(GameController controller, Player player) {
    controller.play(PlayerActionPlayer(player, this));
  }

  @override
  Iterable<Widget> buildWidget(BuildContext context, SceneData sceneData, Player player) {
    var renderBox = sceneData.stacks[stackNumber].followingCardHolder()?.currentContext?.findRenderObject() as RenderBox?;
    var toPosition = renderBox?.localToGlobal(Offset.zero);

    if(toPosition == null) return [const Text("No decks")];

    var playedCard = player.playerGameProperty!.playedCard!;


    return [
      SlideCard(from: sceneData.decks[player.id]!, to: DeckTransform(toPosition, 0), child: CardComponent(card: playedCard))
    ];
  }
}