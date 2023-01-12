import 'package:worfrontend/services/game_controller.dart';

import '../../socket_message.dart';
import 'result.dart';

class Results extends SocketMessage {
  final String idGame;

  final List<Result> results;

  Results(this.idGame, this.results);

  Results.fromJson(Map<String, dynamic> json)
      : idGame = json["id_game"],
        results = (json["results"] as List<dynamic>)
            .map((e) => Result.fromJson(e))
            .toList();

  @override
  Future execute(SocketGameController game) async {
    game.showResult(results);
  }
}
