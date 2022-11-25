import 'package:worfrontend/models/player_model.dart';

class PlayerCollection {
  final List<PlayerModel> players;

  const PlayerCollection(this.players);
  PlayerCollection.empty() : players = List<PlayerModel>.empty();

  appendPlayer(PlayerModel player) {
    players.add(player);
  }

  getPlayer(String id) {
    return players.firstWhere((element) => element.id == id,
        orElse: () => throw Exception("Player not found."));
  }
}
