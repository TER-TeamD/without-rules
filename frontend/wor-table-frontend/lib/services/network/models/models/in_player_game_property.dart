import '../card.dart';

class InPlayerGameProperty {
  //final Card? playedCard;
  final bool hadPlayedTurn;
  final List<GameCard> playerDiscard;

  InPlayerGameProperty(this.hadPlayedTurn, this.playerDiscard);

  InPlayerGameProperty.fromJson(Map<String, dynamic> json)
      : hadPlayedTurn = json["had_played_turn"],
        playerDiscard = (json["player_discard"] as List<dynamic>)
            .map((e) => GameCard.fromJson(e))
            .toList();

  toJson() => {
        'had_played_turn': hadPlayedTurn,
        'player_discard': playerDiscard.map((e) => e.toJson()).toList(),
      };
}
