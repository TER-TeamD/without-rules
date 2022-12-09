import 'package:flutter/widgets.dart';
import 'package:worfrontend/scenes/final_state/final_scene.dart';
import 'package:worfrontend/game_states/game_state.dart';
import 'package:worfrontend/services/network/models/socket_models/results.dart';

class FinalState extends GameState {
  final Results results;
  FinalState(super.runtimeService, this.results);

  @override
  Widget buildUI(BuildContext context) {
    return FinalScene(results: results);
  }
}
