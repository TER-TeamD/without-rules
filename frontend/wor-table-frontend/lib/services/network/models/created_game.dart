class CreatedGame {
  final String idGame;
  final List<String> potentialPlayersId;

  CreatedGame.fromJson(Map<String, dynamic> json)
      : potentialPlayersId = (json["potential_players_id"] as List<dynamic>)
            .map((e) => e as String)
            .toList(),
        idGame = json["id_game"];
}
