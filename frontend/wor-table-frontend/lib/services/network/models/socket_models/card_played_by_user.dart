import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/socket_message.dart';

import '../card.dart';

class CardPlayedByUser extends SocketMessage {

  final String playerId;
  final GameCard playedCard;

  CardPlayedByUser(this.playerId, this.playedCard);
  CardPlayedByUser.fromJson(Map<String, dynamic> json)
      : playerId = json["player_id"],
        playedCard = GameCard.fromJson(json["played_cards"]);

  @override
  void execute(SocketGameController game) async {
    game.playerPlayCard(playerId, playedCard);
  }
}
