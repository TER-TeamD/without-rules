import 'package:flutter/material.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/services/network/models/game_card.dart' as card_model;

enum PlayerState { waiting, playing, revealCard, waitingAfterPlaying }

class PlayerDeck extends StatelessWidget {
  final PlayerState state;
  final PlayerDeckState visualState;
  final card_model.GameCard? playedCard;

  const PlayerDeck({
    super.key,
    this.state = PlayerState.waiting,
    this.playedCard,
    required this.visualState,
  });

  @override
  Widget build(BuildContext context) {
    return visualState.build(context);
  }
}
