import 'package:flutter/cupertino.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';

class DeckNoPlayer extends PlayerDeckState {
  @override
  build(BuildContext context) {
    return const Text("No player.");
  }
}
