import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/game_runtime_service.dart';

abstract class GameState {
  final GameRuntimeService runtimeService;

  const GameState(this.runtimeService);

  Widget buildUI(BuildContext context);
}
