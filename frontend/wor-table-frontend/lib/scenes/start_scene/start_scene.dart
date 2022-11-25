import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:worfrontend/services/game_states/start_state.dart';

class StartScene extends StatefulWidget {
  final StartState state;

  const StartScene({super.key, required this.state});

  @override
  State<StartScene> createState() => _StartSceneState();
}

class _StartSceneState extends State<StartScene> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
