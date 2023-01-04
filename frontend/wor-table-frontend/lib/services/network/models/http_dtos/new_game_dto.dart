class NewGameDto {
  final String idGame;
  final List<String> potentialPlayersId;

  NewGameDto(this.idGame, this.potentialPlayersId);
  NewGameDto.fromJson(Map<String, dynamic> json)
      : idGame = json["id_game"],
        potentialPlayersId = (json["potential_players_id"] as List<dynamic>)
            .map((e) => e as String)
            .toList();
}
