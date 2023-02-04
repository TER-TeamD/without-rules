import 'package:flutter/material.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';

class DeckPlayerAdded extends PlayerDeckState {
  @override
  build(BuildContext context) {
    return const Text("Player added !", style: TextStyle(color: Colors.black));
  }
}
