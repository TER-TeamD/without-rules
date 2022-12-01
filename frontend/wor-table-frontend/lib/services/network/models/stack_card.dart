import 'card.dart';

class StackCard {
  final int stackNumber;
  final Card stackHead;
  final List<Card> stackCards;

  StackCard(this.stackNumber, this.stackHead, this.stackCards);
  StackCard.fromJson(Map<String, dynamic> json)
      : stackNumber = json["stackNumber"],
        stackHead = Card.fromJson(json["stackHead"]),
        stackCards = (json["stackCards"] as List<dynamic>)
            .map((e) => Card.fromJson(e))
            .toList();
}
