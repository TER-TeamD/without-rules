import 'package:worfrontend/services/network/models/stack_card.dart';

import 'card.dart';

class InGameProperty {
  final List<Card> deck;
  final List<StackCard> stacks;

  InGameProperty(this.deck, this.stacks);
  InGameProperty.fromJson(Map<String, dynamic> json)
      : deck = (json["deck"] as List<dynamic>)
            .map((e) => Card.fromJson(e))
            .toList(),
        stacks = (json["stacks"] as List<dynamic>)
            .map((e) => StackCard.fromJson(e))
            .toList();
}
