import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/services/network/models/card.dart';

class DeckPlayed extends PlayerDeckState {
  final GameCard card;

  const DeckPlayed(this.card);

  @override
  build(BuildContext context) {
    return CardComponent(card: card);
  }
}
