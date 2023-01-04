import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_holder_loading.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';

class DeckPlaying extends PlayerDeckState {
  @override
  build(BuildContext context) {
    return const CardHolderLoading();
  }
}
