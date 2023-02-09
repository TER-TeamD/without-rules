import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/services/network/models/game_card.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';

import 'card_components/card_holder.dart';

class StackViewInstance {
  final StackCard stack;
  final List<GlobalKey> card_holders;

  StackViewInstance(this.stack) : card_holders = List.generate(6, (index) => GlobalKey());

  GlobalKey? followingCardHolder() {
    if (card_holders.length <= stack.stackCards.length + 1) return null;
    return card_holders[stack.stackCards.length];
  }

  GameCard getCard(int i) {
    if (i >= stack.stackCards.length + 1) throw "No card at this index.";
    if (i == stack.stackCards.length) return stack.stackHead;
    return stack.stackCards[i];
  }
}

class StacksComponent extends StatelessWidget {
  final List<StackViewInstance> stacks;
  final bool shouldChoose;
  final void Function(StackCard) onStackTap;

  const StacksComponent(
      {Key? key,
      required this.stacks,
      this.shouldChoose = false,
      required this.onStackTap})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
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
                                  child: i >= e.stack.stackCards.length + 1
                                      ? CardHolder(
                                          key: e.card_holders[i],
                                        )
                                      : CardComponent(
                                          key: e.card_holders[i],
                                          card: e.getCard(i),
                                          isStackHead: i == e.stack.stackCards.length,
                                        ),
                                ))
                            .toList(),
                      ),
                    )),
              ),
            )
            .toList(),
      ),
    );
  }
}
