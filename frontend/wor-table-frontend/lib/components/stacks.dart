import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/services/network/models/game_card.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';

import 'card_components/card_holder.dart';

class SceneCard {
  final GameCard card;
  final GlobalKey key;

  SceneCard(this.card, this.key);

  Offset getPosition() {
    var renderObject = key.currentContext?.findRenderObject() as RenderBox?;
    return renderObject?.localToGlobal(Offset.zero) ?? Offset.zero;
  }
}

class StackViewInstance {
  final StackCard stack;
  final List<GlobalKey> card_holders;

  StackViewInstance(this.stack)
      : card_holders = List.generate(6, (index) => GlobalKey());

  GlobalKey? followingCardHolder({bool included = true}) {
    if (card_holders.length <= stack.stackCards.length + 1) return null;
    return card_holders[stack.stackCards.length + (included ? 0 : 1)];
  }

  Offset followingCardHolderPosition({bool included = true}) {
    var fch = followingCardHolder(included: included)
        ?.currentContext
        ?.findRenderObject() as RenderBox?;
    return fch?.localToGlobal(Offset.zero) ?? Offset.zero;
  }

  Iterable<SceneCard> getCards() {
    return Iterable.generate(stack.stackCards.length + 1).map((i) => SceneCard(
        i == stack.stackCards.length ? stack.stackHead : stack.stackCards[i],
        card_holders[i]));
  }

  SceneCard getCard(int i) {
    if (i >= stack.stackCards.length + 1) throw "No card at this index.";
    if (i == stack.stackCards.length)
      return SceneCard(stack.stackHead, card_holders[i]);
    return SceneCard(stack.stackCards[i], card_holders[i]);
  }

  Offset getPosition(int i) {
    var box = card_holders[i].currentContext?.findRenderObject() as RenderBox?;
    return box?.localToGlobal(Offset.zero) ?? Offset.zero;
  }
}

class StacksComponent extends StatelessWidget {
  final List<StackViewInstance> stacks;
  final Set<int> animatedCards;
  final bool shouldChoose;
  final void Function(StackCard) onStackTap;

  const StacksComponent(
      {Key? key,
      required this.stacks,
      required this.animatedCards,
      this.shouldChoose = false,
      required this.onStackTap})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: stacks
          .map(
            (e) => Padding(
              padding: const EdgeInsets.all(8.0),
              child: GestureDetector(
                  behavior: shouldChoose
                      ? HitTestBehavior.opaque
                      : HitTestBehavior.translucent,
                  onTap: () => onStackTap(e.stack),
                  child: Container(
                    decoration: shouldChoose
                        ? BoxDecoration(
                            border: Border.all(color: Colors.white),
                          )
                        : null,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: Iterable.generate(6)
                          .map((i) => Padding(
                                padding: const EdgeInsets.all(4.0),
                                child: i >= e.stack.stackCards.length + 1 ||
                                        animatedCards
                                            .contains(e.getCard(i).card.value)
                                    ? CardHolder(
                                        key: e.card_holders[i],
                                      )
                                    : CardComponent(
                                        key: e.card_holders[i],
                                        card: e.getCard(i).card,
                                        isStackHead:
                                            i == e.stack.stackCards.length,
                                      ),
                              ))
                          .toList(),
                    ),
                  )),
            ),
          )
          .toList(),
    );
  }
}
