import 'card.dart';

class InPlayerGameProperty {
  final Card playedCard;
  final bool hadPlayedTurn;
  final List<Card> playerDiscard;

  InPlayerGameProperty(this.playedCard, this.hadPlayedTurn, this.playerDiscard);

  InPlayerGameProperty.fromJson(Map<String, dynamic> json)
      : playedCard = json["played_card"],
        hadPlayedTurn = json["had_played_turn"],
        playerDiscard = (json["player_discard"] as List<dynamic>)
            .map((e) => Card.fromJson(e))
            .toList();
}
