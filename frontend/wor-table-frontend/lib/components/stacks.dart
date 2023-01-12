import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';

class StackViewInstance {
  final StackCard stack;
  final GlobalKey key;

  StackViewInstance(this.stack) : key = GlobalKey();
}

class StacksComponent extends StatelessWidget {
  final List<StackViewInstance> stacks;
  const StacksComponent({Key? key, required this.stacks}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: stacks
            .map((e) => CardComponent(key: e.key, card: e.stack.stackHead))
            .toList(),
      ),
    );
  }
}
