import 'package:worfrontend/services/network/models/in_game_property.dart';
import 'package:worfrontend/services/network/models/player.dart';

class Game {
  final List<Player> players;
  final InGameProperty? inGameProperty;

  Game(this.players, this.inGameProperty);
  Game.fromJson(Map<String, dynamic> json)
      : players = (json["players"] as List<dynamic>)
            .map((e) => Player.fromJson(e))
            .toList(),
        inGameProperty = json["in_game_property"] == null
            ? null
            : InGameProperty.fromJson(json["in_game_property"]);
}
