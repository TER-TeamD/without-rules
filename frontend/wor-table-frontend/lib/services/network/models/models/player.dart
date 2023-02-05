import 'package:worfrontend/services/network/models/models/player_game_result.dart';

import '../card.dart';
import 'in_player_game_property.dart';

class Player {
  final String id;
  final bool isLogged;
  final List<GameCard> cards;
  final List<GameCard> playedCards;
  final InPlayerGameProperty? playerGameProperty;
  final PlayerGameResult gameResult;

  Player(this.id, this.isLogged, this.cards, this.playedCards,
      this.playerGameProperty, this.gameResult);

  Player.fromJson(Map<String, dynamic> json)
      : id = json["id"],
        isLogged = json["is_logged"],
        cards = (json["cards"] as List<dynamic>)
            .map((e) => GameCard.fromJson(e))
            .toList(),
        playedCards = (json["played_cards"] as List<dynamic>)
            .map((e) => GameCard.fromJson(e))
            .toList(growable: false),
        playerGameProperty = json["in_player_game_property"] == null
            ? null
            : InPlayerGameProperty.fromJson(json["in_player_game_property"]),
        gameResult = PlayerGameResult.fromJson(json["gameResult"]);

  toJson() => {
    'id': id,
    'is_logged': isLogged,
    'cards': cards.map((e) => e.toJson()).toList(growable: false),
    'played_cards': playedCards.map((e) => e.toJson()).toList(growable: false),
    'in_player_game_property': playerGameProperty?.toJson(),
    'gameResult': gameResult.toJson(),
  };
}
