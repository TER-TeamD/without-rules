import 'package:flutter/widgets.dart';

import '../services/network/models/http_dtos/player.dart';

class TablePlayer {
  final Player player;
  final Offset position;

  TablePlayer(this.player, this.position);
}
