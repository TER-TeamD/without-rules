import '../card.dart';
import '../stack_card.dart';

class InGameProperty {
  final List<GameCard> deck;
  final List<StackCard> stacks;

  InGameProperty(this.deck, this.stacks);
  InGameProperty.fromJson(Map<String, dynamic> json)
      : deck = (json["deck"] as List<dynamic>)
            .map((e) => GameCard.fromJson(e))
            .toList(),
        stacks = (json["stacks"] as List<dynamic>)
            .map((e) => StackCard.fromJson(e))
            .toList();
}
