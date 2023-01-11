import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/socket_message.dart';

import '../card.dart';

class CardPlayedByUser extends SocketMessage {

  final String idGame;
  final String playerId;
  final Card playedCard;

  CardPlayedByUser(this.idGame, this.playerId, this.playedCard);
  CardPlayedByUser.fromJson(Map<String, dynamic> json)
      : idGame = json["id_game"],
        playerId = json["player_id"],
        playedCard = Card.fromJson(json["played_cards"]);

  @override
  void execute(SocketGameController game) async {
    game.playerPlayCard(playerId, playedCard);
  }
}
