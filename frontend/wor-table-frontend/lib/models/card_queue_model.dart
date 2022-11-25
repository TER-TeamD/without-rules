import 'card_model.dart';

class CardQueueModel {
  final List<CardModel> cards;

  CardQueueModel(this.cards);

  CardQueueModel.fromJson(Map<String, dynamic> json)
      : cards = (json["cards"] as List<int>)
            .map((e) => CardModel.cards.firstWhere(
                (element) => e == element.value,
                orElse: () => throw Exception("Unknown card: $e")))
            .toList();
}
