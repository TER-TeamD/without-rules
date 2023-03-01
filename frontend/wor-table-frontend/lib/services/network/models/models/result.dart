
// {rank: 1, id_player: blf3109, cattle_heads: 275}
class Result {
  final int rank;
  final String idPlayer;
  final int cattleHeads;
  final String? username;
  final String? avatar;

  Result(this.rank, this.idPlayer, this.cattleHeads, this.avatar, this.username);
  Result.fromJson(Map<String, dynamic> json)
      : rank = json["rank"],
        idPlayer = json["id_player"],
        cattleHeads = json["cattle_heads"],
        username = json["username"],
        avatar = json["avatar"]
  ;
}
