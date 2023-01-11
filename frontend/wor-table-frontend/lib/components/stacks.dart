import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';

class StacksComponent extends StatelessWidget {
  final List<StackCard> stacks;
  const StacksComponent({Key? key, required this.stacks}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: stacks
            .map((e) => CardComponent(card: e.stackHead))
            .toList(),
      ),
    );
  }
}
