import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/game_controller.dart';

abstract class GameState {
  const GameState();

  void onLoad() {}

  Widget buildUI(BuildContext context);
}
