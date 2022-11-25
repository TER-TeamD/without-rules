import 'package:worfrontend/services/network/network_message.dart';

class PlayerPlayed extends NetworkMessage {
  final String playerId;

  PlayerPlayed.fromJson(Map<String, dynamic> json)
      : playerId = json["playerId"];
}
