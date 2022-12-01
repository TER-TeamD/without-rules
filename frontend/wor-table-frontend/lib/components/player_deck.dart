import 'package:flutter/material.dart';
import 'package:worfrontend/components/card_components/card_back.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/card_components/card_holder.dart';
import 'package:worfrontend/components/card_components/card_holder_loading.dart';

import '../services/network/models/card.dart' as card_model;

enum PlayerState { waiting, playing, revealCard, waitingAfterPlaying }

class PlayerDeck extends StatelessWidget {
  final PlayerState state;
  final card_model.Card? playedCard;

  const PlayerDeck(
      {super.key, this.state = PlayerState.waiting, this.playedCard});

  @override
  Widget build(BuildContext context) {
    switch (state) {
      case PlayerState.waiting:
        return const CardHolder();
      case PlayerState.playing:
        return const CardHolderLoading();
      case PlayerState.waitingAfterPlaying:
        return const CardBack();
      case PlayerState.revealCard:
        if (playedCard == null) throw "PlayedCard was null";
        return CardComponent(card: playedCard!);
    }
  }
}
