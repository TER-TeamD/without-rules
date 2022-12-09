import 'package:flutter/src/widgets/framework.dart';
import 'package:worfrontend/components/card_components/card_back.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';

class DeckWaitOtherPlayers extends PlayerDeckState {
  @override
  build(BuildContext context) {
    return const CardBack();
  }
}
