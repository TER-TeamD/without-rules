import 'package:worfrontend/services/network/socket_message.dart/socket_message.dart';

import '../card.dart';
import 'message_types.dart';

class CardPlayedByUser extends TableSocketMessage {
  @override
  String topic;
  @override
  final String idGame;
  final String playerId;
  final Card playedCard;

  CardPlayedByUser(
      this.topic, this.type, this.idGame, this.playerId, this.playedCard);
  CardPlayedByUser.fromJson(this.topic, this.type, Map<String, dynamic> json)
      : idGame = json["id_game"],
        playerId = json["player_id"],
        playedCard = Card.fromJson(json["played_cards"]);

  @override
  SocketMessageTypes type;
}
