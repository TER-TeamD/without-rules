import 'card.dart';

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
}
