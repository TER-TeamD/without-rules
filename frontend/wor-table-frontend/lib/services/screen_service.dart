import 'dart:math' as math;

import 'package:flutter/cupertino.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/stacks.dart';

class StackPosition {
  final Offset position;
  final int number;

  StackPosition(this.position, this.number);
}

class ScreenService {
  Size? _screenSize;
  List<StackPosition> stacks = [];

  void setScreenSize(BuildContext context) {
    _screenSize = MediaQuery.of(context).size;
  }

  getPositions() {
    if (_screenSize == null) throw "The screen size has not been set yet.";
    return [
      ...Iterable.generate(4)
          .map((i) => DeckTransform(Offset((1 / 5) * (i + 1), 1 / 5), math.pi)),
      ...Iterable.generate(4)
          .map((i) => DeckTransform(Offset((1 / 5) * (i + 1), 4 / 5), 0)),
      const DeckTransform(Offset(1 / 5, 1 / 2), 3 * math.pi / 2),
      const DeckTransform(Offset(4 / 5, 1 / 2), math.pi / 2)
    ]
        .map((e) => DeckTransform(
            Offset(e.position.dx * _screenSize!.width,
                e.position.dy * _screenSize!.height),
            e.rotation))
        .toList(growable: false);
  }

  void setStackPositions(List<StackViewInstance> stacks) {
    this.stacks = stacks.map((stack) {
      var context = stack.key.currentContext;
      if(context == null) throw "The context of the stack is null.";
      var box = context.findRenderObject() as RenderBox;

      return StackPosition(box.localToGlobal(Offset.zero), stack.stack.stackNumber);
    }).toList(growable: false);
  }

  Offset getStackPosition(int stack) {
    return stacks.firstWhere((element) => element.number == stack, orElse: () => throw "Stack not found.").position;
  }
}
