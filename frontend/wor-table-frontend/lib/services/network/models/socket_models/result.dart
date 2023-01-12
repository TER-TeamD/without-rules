
// {rank: 1, id_player: blf3109, cattle_heads: 275}
class Result {
  final int rank;
  final String idPlayer;
  final int cattleHeads;

  Result(this.rank, this.idPlayer, this.cattleHeads);
  Result.fromJson(Map<String, dynamic> json)
      : rank = json["rank"],
        idPlayer = json["id_player"],
        cattleHeads = json["cattle_heads"];
}
