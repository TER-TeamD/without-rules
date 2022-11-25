import 'package:flutter/src/widgets/framework.dart';
import 'package:worfrontend/scenes/start_scene/start_scene.dart';
import 'package:worfrontend/services/game_states/game_state.dart';

class StartState extends GameState {
  StartState(super.runtimeService);

  @override
  Widget buildUI(BuildContext context) {
    return StartScene(state: this);
  }
}
