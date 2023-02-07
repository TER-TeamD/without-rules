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

  Map<String, DeckTransform> getMapPosition(List<String> ids) {
    if(ids.length > 10) throw "The list of ids is too long (max length: 10).";
    var positions = getPositions();
    return Map.fromEntries(Iterable.generate(ids.length).map((i) => MapEntry(ids[i], positions[i])));
  }
}
