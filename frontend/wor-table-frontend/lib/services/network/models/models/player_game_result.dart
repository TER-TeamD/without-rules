class PlayerGameResult {
  final int cattleHeads;
  final int ranking;

  PlayerGameResult(this.cattleHeads, this.ranking);

  PlayerGameResult.fromJson(Map<String, dynamic> json)
      : cattleHeads = json["cattleHeads"],
        ranking = json["ranking"];

  toJson() => {
        'cattleHeads': cattleHeads,
        'ranking': ranking,
      };
}
