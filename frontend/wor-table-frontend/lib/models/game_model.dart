import 'package:worfrontend/models/card_queue_model.dart';

class GameModel {
  final List<CardQueueModel> queues;

  GameModel(this.queues);

  GameModel.fromJson(Map<String, dynamic> json)
      : queues = (json["queues"] as List<dynamic>)
            .map((e) => CardQueueModel.fromJson(e as Map<String, dynamic>))
            .toList(growable: false);
}
