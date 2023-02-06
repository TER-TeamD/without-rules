class GameCard {
  final int value;
  final int cattleHead;

  GameCard(this.value, this.cattleHead);

  GameCard.fromJson(Map<String, dynamic> json)
      : value = json["value"],
        cattleHead = json["cattleHead"];

  toJson() => {
        'value': value,
        'cattleHead': cattleHead,
      };
}
