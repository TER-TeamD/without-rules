import 'package:worfrontend/services/network/models/models/between_round.dart';

import '../card.dart';
import '../stack_card.dart';

class InGameProperty {
  final List<GameCard> deck;
  final List<StackCard> stacks;
  final int currentRound;
  final BetweenRound? betweenRound;

  InGameProperty(this.deck, this.stacks, this.currentRound, this.betweenRound);

  InGameProperty.fromJson(Map<String, dynamic> json)
      : deck = (json["deck"] as List<dynamic>)
            .map((e) => GameCard.fromJson(e))
            .toList(),
        stacks = (json["stacks"] as List<dynamic>)
            .map((e) => StackCard.fromJson(e))
            .toList(),
        currentRound = json["current_round"],
        betweenRound = json['between_round'] == null
            ? null
            : BetweenRound.fromJson(json['between_round']);
}
