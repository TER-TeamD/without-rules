import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';

class DeckWaitPlayer extends PlayerDeckState {
  final String id;

  const DeckWaitPlayer(this.id);

  @override
  build(BuildContext context) {
    return SizedBox(
      width: 200,
      height: 110,
      child: Container(
        decoration: const BoxDecoration(
            color: Color.fromARGB(255, 161, 161, 161),
            borderRadius: BorderRadius.all(Radius.circular(10))),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Column(
              children: [
                QrImage(
                  data: id,
                  size: 90,
                ),
                Text("Id: $id")
              ],
            )
          ],
        ),
      ),
    );
  }
}
