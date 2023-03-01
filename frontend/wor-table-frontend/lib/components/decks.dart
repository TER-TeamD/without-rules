import 'package:flutter/cupertino.dart';
import 'package:worfrontend/components/player_deck/player_deck.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/components/player_deck/player_spot.dart';
import 'package:worfrontend/components/player_deck_footer/player_deck_footer.dart';
import 'package:worfrontend/components/player_deck_footer/player_deck_footer_state.dart';
import 'package:worfrontend/models/transform.dart';
import 'package:worfrontend/services/game_controller.dart';

class PositionedPlayerDeckState {
  final String playerId;
  PlayerDeckState state;
  AppTransform transform;
  PlayerDeckFooterState footerState;

  PositionedPlayerDeckState(this.playerId, this.state, this.transform, this.footerState);
}

class Decks extends StatelessWidget {
  final List<PositionedPlayerDeckState> states;
  final GameController controller;

  const Decks({super.key, required this.states, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Stack(
        children: states
            .map((state) => PlayerSpot(
                position: state.transform.position,
                rotation: state.transform.rotation,
                positionChanged: (transform) {
                  state.transform = transform;
                  controller.deckTransformChanged(state.playerId, state.transform);
                },
                childBottom: Center(
                    child: PlayerDeckFooter(visualState: state.footerState,),
                ),
                child: PlayerDeck(visualState: state.state),
              ))
            .toList(growable: false));
  }
}
