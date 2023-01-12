import 'in_player_game_property.dart';
import '../card.dart';

class Player {
  final String id;
  final bool isLogged;
  final List<GameCard> cards;
  final InPlayerGameProperty? playerGameProperty;

  Player(this.id, this.isLogged, this.cards, this.playerGameProperty);
  Player.fromJson(Map<String, dynamic> json)
      : id = json["id"],
        isLogged = json["is_logged"],
        cards = (json["cards"] as List<dynamic>)
            .map((e) => GameCard.fromJson(e))
            .toList(),
        playerGameProperty = json["in_player_game_property"] == null
            ? null
            : InPlayerGameProperty.fromJson(json["in_player_game_property"]);
}
