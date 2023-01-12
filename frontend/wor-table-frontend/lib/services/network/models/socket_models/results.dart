import 'package:worfrontend/services/game_controller.dart';

import '../../socket_message.dart';
import 'result.dart';

//2023-01-12T18:39:40.037 | Data received from RESULTS: {results: [{rank: 1, id_player: blf3109, cattle_heads: 275}, {rank: 2, id_player: nh888vg, cattle_heads: 319}]}

class Results extends SocketMessage {

  final List<Result> results;


  Results(this.results);

  Results.fromJson(Map<String, dynamic> json)
      : results = (json["results"] as List<dynamic>)
            .map((e) => Result.fromJson(e))
            .toList();

  @override
  Future execute(SocketGameController game) async {
    game.showResult(results);
  }
}
