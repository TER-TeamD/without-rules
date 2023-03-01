

import 'package:flutter/material.dart';
import 'package:worfrontend/components/player_deck/player_deck.dart';
import 'package:worfrontend/components/player_deck_footer/player_deck_footer_state.dart';



class PlayerDeckFooter extends StatelessWidget {
  final PlayerState state;
  final PlayerDeckFooterState visualState;

  const PlayerDeckFooter({
    super.key,
    this.state = PlayerState.waiting,
    required this.visualState,
  });


  @override
  Widget build(BuildContext context) {
    return visualState.build(context);
  }
}
