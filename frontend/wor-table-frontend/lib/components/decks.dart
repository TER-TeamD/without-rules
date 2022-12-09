import 'package:flutter/cupertino.dart';
import 'package:worfrontend/components/player_deck/player_deck.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/components/player_deck/player_spot.dart';
import 'package:worfrontend/components/player_deck/states/no_player.dart';

class DeckTransform {
  final Offset position;
  final int orientation;

  const DeckTransform(this.position, this.orientation);
}

class Decks extends StatelessWidget {
  final Map<String, PlayerDeckState> states;

  const Decks({super.key, required this.states});

  List<DeckTransform> getPositions(BuildContext context) {
    var size = MediaQuery.of(context).size;
    return [
      ...Iterable.generate(4)
          .map((i) => DeckTransform(Offset((1 / 5) * (i + 1), 1 / 5), 2)),
      ...Iterable.generate(4)
          .map((i) => DeckTransform(Offset((1 / 5) * (i + 1), 4 / 5), 0)),
      const DeckTransform(Offset(1 / 5, 1 / 2), 3),
      const DeckTransform(Offset(4 / 5, 1 / 2), 1)
    ]
        .map((e) => DeckTransform(
            Offset(e.position.dx * size.width, e.position.dy * size.height),
            e.orientation))
        .toList(growable: false);
  }

  List<PlayerDeckState> getOrdenedStates() {
    var result = states.entries.toList(growable: false);
    result.sort(((a, b) => a.key.compareTo(b.key)));
    return result.map((e) => e.value).toList(growable: false);
  }

  @override
  Widget build(BuildContext context) {
    //if (states.length != 10) throw "There is some missing states.";
    var positions = getPositions(context);
    var ordenedStates = getOrdenedStates();
    return Stack(
        children: Iterable.generate(states.length)
            .map((i) => PlayerSpot(
                position: positions[i].position,
                orientation: positions[i].orientation,
                child: i >= states.length
                    ? PlayerDeck(visualState: DeckNoPlayer())
                    : PlayerDeck(visualState: ordenedStates[i])))
            .toList(growable: false));
  }
}
