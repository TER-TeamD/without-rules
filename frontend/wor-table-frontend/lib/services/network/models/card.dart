class Card {
  final int value;
  final int cattleHead;

  Card(this.value, this.cattleHead);
  Card.fromJson(Map<String, dynamic> json)
      : value = json["value"],
        cattleHead = json["cattleHead"];
}
