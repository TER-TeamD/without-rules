class CardModel {
  final int value;
  final int bulls;

  const CardModel(this.value, this.bulls);

  static List<CardModel> cards = List.from([], growable: false);
}
