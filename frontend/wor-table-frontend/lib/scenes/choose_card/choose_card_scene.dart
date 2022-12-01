import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/game_states/game_runtime_state.dart';

import '../../services/network/models/game.dart';

class ChooseCardScene extends StatefulWidget {
  final GameRuntimeState state;

  const ChooseCardScene({super.key, required this.state});

  @override
  State<ChooseCardScene> createState() => _ChooseCardSceneState();
}

class _ChooseCardSceneState extends State<ChooseCardScene> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
