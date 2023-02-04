import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';

class DeckWaitPlayer extends PlayerDeckState {
  final String id;

  const DeckWaitPlayer(this.id);

  @override
  build(BuildContext context) {
    return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text(
                "Identifiant",
              style: const TextStyle(
                fontSize: 10.0
              ),
            ),
            Text(
              id,
              style: const TextStyle(
                fontWeight: FontWeight.bold
              ),
            )
          ],
        )
      );
  }
}
