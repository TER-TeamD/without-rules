import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_back.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/services/network/models/models/player.dart';

class DeckWaitOtherPlayers extends PlayerDeckState {
  final Player player;

  const DeckWaitOtherPlayers(this.player);

  @override
  build(BuildContext context) {
    return CardBack(player: this.player);
  }
}
