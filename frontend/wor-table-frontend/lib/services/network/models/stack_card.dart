

import 'package:worfrontend/services/network/models/game_card.dart';

class StackCard {
  final int stackNumber;
  final GameCard stackHead;
  final List<GameCard> stackCards;

  StackCard(this.stackNumber, this.stackHead, this.stackCards);

  StackCard.fromJson(Map<String, dynamic> json)
      : stackNumber = json["stackNumber"],
        stackHead = GameCard.fromJson(json["stackHead"]),
        stackCards = (json["stackCards"] as List<dynamic>)
            .map((e) => GameCard.fromJson(e))
            .toList();

  toJson() => {
        'stackNumber': stackNumber,
        'stackHead': stackHead.toJson(),
        'stackCards': stackCards.map((e) => e.toJson()).toList(),
      };
}
