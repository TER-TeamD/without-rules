import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';
import 'package:worfrontend/services/network/models/game_card.dart';

class DeckPlayed extends PlayerDeckState {
  final GameCard card;
  final int order;

  const DeckPlayed(this.card, this.order);

  @override
  build(BuildContext context) {
    return Stack(children: [
      CardComponent(card: card, isStackHead: true),
      Container(
          alignment: Alignment.topRight,
          child: SizedBox(
              width: 20,
              height: 20,
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(10)),
                child: Text(
                  order.toString(),
                  style: TextStyle(fontSize: 15, color: Colors.white),
                ),
              )))
    ]);
  }
}
