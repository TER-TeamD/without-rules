import 'package:flutter/cupertino.dart';
import 'package:worfrontend/components/player_deck/player_deck.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/components/player_deck/player_spot.dart';
import 'package:worfrontend/components/player_deck_footer/player_deck_footer.dart';
import 'package:worfrontend/components/player_deck_footer/player_deck_footer_state.dart';

class DeckTransform {
  final Offset position;
  final double rotation;

  const DeckTransform(this.position, this.rotation);
}

class PositionedPlayerDeckState {
  final String playerId;
  PlayerDeckState state;
  DeckTransform transform;
  PlayerDeckFooterState footerState;

  PositionedPlayerDeckState(this.playerId, this.state, this.transform, this.footerState);
}

class Decks extends StatelessWidget {
  final List<PositionedPlayerDeckState> states;

  const Decks({super.key, required this.states});

  @override
  Widget build(BuildContext context) {
    return Stack(
        children: states
            .map((state) => PlayerSpot(
                position: state.transform.position,
                rotation: state.transform.rotation,
                positionChanged: (transform) {
                  state.transform = transform;
                },
                child: PlayerDeck(visualState: state.state),
                childBottom: Center(
                    child: PlayerDeckFooter(visualState: state.footerState,),
                ),
              ))
            .toList(growable: false));
  }
}
