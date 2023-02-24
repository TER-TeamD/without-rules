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

  void setScreenSize(BuildContext context) {
    _screenSize = MediaQuery.of(context).size;
  }

  List<AppTransform> getPositions() {
    if (_screenSize == null) throw "The screen size has not been set yet.";
    return [
      ...Iterable.generate(3)
          .map((i) => AppTransform(Offset((1 / 4) * (i + 1), 1 / 5), math.pi)),
      ...Iterable.generate(3)
          .map((i) => AppTransform(Offset((1 / 4) * (i + 1), 4 / 5), 0)),
      const AppTransform(Offset(1 / 6, 1 / 2), 3 * math.pi / 2),
      const AppTransform(Offset(5 / 6, 1 / 2), math.pi / 2)
    ]
        .map((e) => AppTransform(
            Offset(e.position.dx * _screenSize!.width,
                e.position.dy * _screenSize!.height),
            e.rotation))
        .toList(growable: false);
  }

  Map<String, AppTransform> getMapPosition(List<String> ids) {
    if(ids.length > 8) throw "The list of ids is too long (max length: 10).";
    var positions = getPositions();
    return Map<String, AppTransform>.fromEntries(Iterable.generate(ids.length).map((e) => MapEntry(ids[e], positions[e])));
  }
}
