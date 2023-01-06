import 'package:flutter/widgets.dart';
import 'package:worfrontend/scenes/final_state/final_scene.dart';
import 'package:worfrontend/game_states/game_state.dart';
import '../services/network/models/socket_models/result.dart';

class FinalState extends GameState {
  final List<Result> results;
  FinalState(this.results);

  @override
  Widget buildUI(BuildContext context) {
    return FinalScene(results: results);
  }
}
