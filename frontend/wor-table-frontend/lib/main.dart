import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/errors/app_error.dart';
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/game_runtime_service.dart';
import 'package:worfrontend/game_states/game_runtime_state.dart';
import 'package:worfrontend/game_states/game_state.dart';
import 'package:worfrontend/game_states/wait_server.dart';
import 'package:worfrontend/services/network/network_service.dart';
import 'package:worfrontend/services/table_service.dart';
import 'package:worfrontend/services/table_service_mock.dart';

Future initScene(
    GameRuntimeService runtimeService, TableService tableService) async {
  // var createdGame = await tableService.createGame();
  // for (var i in Iterable.generate(createdGame.potentialPlayersId.length)) {
  //   tableService.setPlayerPosition(
  //       createdGame.potentialPlayersId[i], Offset(100.0 + i * 300.0, 100));
  // }

  // var game = await tableService.startGame();
  runtimeService.changeState(WaitServerState(runtimeService));
}

void main() {
  GetIt.I.registerSingleton<ErrorManager>(ErrorManager());
  var service = NetworkService("localhost:8451");
  service.connect();
  //GetIt.I.registerSingleton(service);
  var tableService = TableServiceImplementation(service);
  GetIt.I.registerSingleton<TableService>(tableService);

  var runtimeService = GameRuntimeService();
  //var firstState = WaitServerState(runtimeService);

  Future.wait([initScene(runtimeService, tableService)]);
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
  AppError? error;

  @override
  void initState() {
    super.initState();
    state = widget.gameRuntime.state;
    widget.gameRuntime.stateObservable.listen((value) => setState(() {
          state = value;
        }));

    // Display errors
    GetIt.I.get<ErrorManager>().onError.listen((value) {
      setState(() {
        error = value;
      });
    });
    error = GetIt.I.get<ErrorManager>().error;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: error == null
            ? Container(child: state.buildUI(context))
            : drawError(context),
      ),
    );
  }

  Widget drawError(BuildContext context) {
    return Center(child: Text('Error: ${error!.screenMessage()}'));
  }
}
