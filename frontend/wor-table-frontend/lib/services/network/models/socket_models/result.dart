class Result {
  final String idPlayer;
  final bool isWinner;

  Result(this.idPlayer, this.isWinner);

  Result.fromJson(Map<String, dynamic> json)
      : idPlayer = json["id_player"],
        isWinner = json["is_winner"];
}
