import 'package:worfrontend/services/network/models/models/player.dart';

class PlayerFlipOrder {
  final Player player;
  final int order;

  PlayerFlipOrder(this.player, this.order);
  PlayerFlipOrder.fromJson(Map<String, dynamic> json)
      : player = Player.fromJson(json["player"]),
        order = json["order"];

  toJson() => {
    'player': player.toJson(),
    'order': order,
  };
}