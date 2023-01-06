import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/http_dtos/game.dart';
import 'package:worfrontend/services/network/socket_message.dart/socket_message.dart';

import 'result.dart';
import 'message_types.dart';

class Results extends TableSocketMessage {
  @override
  String topic;
  @override
  final String idGame;
  final List<Result> results;

  Results(this.topic, this.type, this.idGame, this.results);
  Results.fromJson(this.topic, this.type, Map<String, dynamic> json)
      : idGame = json["id_game"],
        results = (json["results"] as List<dynamic>)
            .map((e) => Result.fromJson(e))
            .toList();

  @override
  SocketMessageTypes type;

  @override
  Future execute(GameController game) async {
    game.showResult(results);
  }
}
