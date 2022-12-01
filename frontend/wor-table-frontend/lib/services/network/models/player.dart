import 'package:worfrontend/services/network/models/InPlayerGameProperty.dart';

import 'card.dart';

class Player {
  final String id;
  final bool isLogged;
  final List<Card> cards;
  final InPlayerGameProperty? playerGameProperty;

  Player(this.id, this.isLogged, this.cards, this.playerGameProperty);
  Player.fromJson(Map<String, dynamic> json)
      : id = json["id"],
        isLogged = json["is_logged"],
        cards = (json["cards"] as List<dynamic>)
            .map((e) => Card.fromJson(e))
            .toList(),
        playerGameProperty = json["in_player_game_property"] == null
            ? null
            : InPlayerGameProperty.fromJson(json["in_player_game_property"]);
}
