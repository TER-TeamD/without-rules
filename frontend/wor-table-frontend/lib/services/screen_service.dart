import 'dart:math' as math;

import 'package:flutter/cupertino.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/stacks.dart';
import 'package:worfrontend/models/transform.dart';

class StackPosition {
  final Offset position;
  final int number;

  StackPosition(this.position, this.number);
}

class ScreenService {
  Size? _screenSize;
  Map<String, AppTransform>? positions = null;

  void setScreenSize(BuildContext context) {
    _screenSize = MediaQuery.of(context).size;
  }

  getPositions() {
    if (_screenSize == null) throw "The screen size has not been set yet.";
    return [
      ...Iterable.generate(4)
          .map((i) => AppTransform(Offset((1 / 5) * (i + 1), 1 / 5), math.pi)),
      ...Iterable.generate(4)
          .map((i) => AppTransform(Offset((1 / 5) * (i + 1), 4 / 5), 0)),
      const AppTransform(Offset(1 / 5, 1 / 2), 3 * math.pi / 2),
      const AppTransform(Offset(4 / 5, 1 / 2), math.pi / 2)
    ]
        .map((e) => AppTransform(
            Offset(e.position.dx * _screenSize!.width,
                e.position.dy * _screenSize!.height),
            e.rotation))
        .toList(growable: false);
  }

  Map<String, AppTransform> getMapPosition(List<String> ids) {
    if(ids.length > 10) throw "The list of ids is too long (max length: 10).";
    if(positions == null) {
      var pos = getPositions();
      positions = Map.fromEntries(
          Iterable.generate(ids.length).map((i) => MapEntry(ids[i], pos[i])));
    }
    return positions!;
  }
}
