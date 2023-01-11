import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/socket_message.dart';
import '../stack_card.dart';

class InitiateGame extends SocketMessage {

  final List<StackCard> stacks;

  InitiateGame.fromJson(Map<String, dynamic> json)
      : stacks = (json["stack_cards"] as List<dynamic>)
            .map((e) => StackCard.fromJson(e))
            .toList();

  @override
  void execute(SocketGameController game) async {
    game.initiateGame(stacks);
  }
}
