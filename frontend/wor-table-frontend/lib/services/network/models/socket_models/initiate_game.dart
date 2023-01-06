import 'package:worfrontend/services/network/models/http_dtos/game.dart';
import 'package:worfrontend/services/network/socket_message.dart/socket_message.dart';

import '../stack_card.dart';
import 'message_types.dart';

class InitiateGame extends TableSocketMessage {
  @override
  String topic;
  @override
  final String idGame;
  final List<StackCard> stacks;

  InitiateGame(this.topic, this.type, this.idGame, this.stacks);
  InitiateGame.fromJson(this.topic, this.type, Map<String, dynamic> json)
      : idGame = json["id_game"],
        stacks = (json["stacks"] as List<dynamic>)
            .map((e) => StackCard.fromJson(e))
            .toList();

  @override
  SocketMessageTypes type;

  @override
  Future execute(Game game) async {
    game.initiateGame(stacks);
  }
}
