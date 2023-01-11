import 'package:flutter/cupertino.dart';
import 'package:worfrontend/components/player_deck/player_deck.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/components/player_deck/player_spot.dart';
import 'package:worfrontend/components/player_deck/states/no_player.dart';
import 'dart:math' as math;

class DeckTransform {
  final Offset position;
  final double rotation;

  const DeckTransform(this.position, this.rotation);
}

class Decks extends StatelessWidget {
  final Map<String, PlayerDeckState> states;

  const Decks({super.key, required this.states});

  List<DeckTransform> getPositions(BuildContext context) {
    var size = MediaQuery.of(context).size;
    return [
      ...Iterable.generate(4)
          .map((i) => DeckTransform(Offset((1 / 5) * (i + 1), 1 / 5), math.pi)),
      ...Iterable.generate(4)
          .map((i) => DeckTransform(Offset((1 / 5) * (i + 1), 4 / 5), 0)),
      const DeckTransform(Offset(1 / 5, 1 / 2), 3 * math.pi / 2),
      const DeckTransform(Offset(4 / 5, 1 / 2), math.pi / 2)
    ]
        .map((e) => DeckTransform(
            Offset(e.position.dx * size.width, e.position.dy * size.height),
            e.rotation))
        .toList(growable: false);
  }

  List<MapEntry<String, PlayerDeckState>> getOrderedStates() {
    var result = states.entries.toList(growable: false);
    result.sort(((a, b) => a.key.compareTo(b.key)));
    return result.toList(growable: false);
  }

  @override
  Widget build(BuildContext context) {
    //if (states.length != 10) throw "There is some missing states.";
    var positions = getPositions(context);
    var orderedState = getOrderedStates();
    return Stack(
        children: Iterable.generate(states.length)
            .map((i) => PlayerSpot(
                position: positions[i].position,
                rotation: positions[i].rotation,
                child: i >= states.length
                    ? PlayerDeck(visualState: DeckNoPlayer(id: orderedState[i].key))
                    : PlayerDeck(visualState: orderedState[i].value)))
            .toList(growable: false));
  }
}
