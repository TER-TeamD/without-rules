import 'package:flutter/material.dart';
import 'package:worfrontend/services/game_runtime_service.dart';
import 'package:worfrontend/services/game_states/game_state.dart';
import 'package:worfrontend/services/game_states/wait_players.dart';

void main() {
  var runtimeService = GameRuntimeService();
  var firstState =
      WaitPlayerState(runtimeService, List<String>.from(["Id1", "Id2"]));
  runtimeService.changeState(firstState);

  runApp(MyApp(gameRuntime: runtimeService));
}

class MyApp extends StatefulWidget {
  GameRuntimeService gameRuntime;

  MyApp({super.key, required this.gameRuntime});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late GameState state;

  @override
  void initState() {
    super.initState();
    state = widget.gameRuntime.state;
    widget.gameRuntime.stateObservable.listen((value) => setState(() {
          state = value;
        }));
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Container(child: state.buildUI(context)),
      ),
    );
  }
}
