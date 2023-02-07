import 'package:worfrontend/services/network/models/game_card.dart';

class InPlayerGameProperty {
  //final Card? playedCard;
  final bool hadPlayedTurn;
  final List<GameCard> playerDiscard;
  final GameCard? playedCard;

  InPlayerGameProperty(this.hadPlayedTurn, this.playerDiscard, this.playedCard);

  InPlayerGameProperty.fromJson(Map<String, dynamic> json)
      : hadPlayedTurn = json["had_played_turn"],
        playerDiscard = (json["player_discard"] as List<dynamic>)
            .map((e) => GameCard.fromJson(e))
            .toList(),
        playedCard = json["played_card"] != null ? GameCard.fromJson(json["played_card"]) : null;

  toJson() => {
        'had_played_turn': hadPlayedTurn,
        'player_discard': playerDiscard.map((e) => e.toJson()).toList(),
        'played_card': playedCard?.toJson(),
      };
}
