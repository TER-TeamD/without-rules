import '../card.dart';

class InPlayerGameProperty {
  //final Card? playedCard;
  final bool hadPlayedTurn;
  final List<Card> playerDiscard;

  InPlayerGameProperty(this.hadPlayedTurn, this.playerDiscard);

  InPlayerGameProperty.fromJson(Map<String, dynamic> json)
      : hadPlayedTurn = json["had_played_turn"],
        playerDiscard = (json["player_discard"] as List<dynamic>)
            .map((e) => Card.fromJson(e))
            .toList();
}
