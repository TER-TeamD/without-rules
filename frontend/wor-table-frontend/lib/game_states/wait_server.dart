// ignore: implementation_imports
import 'package:flutter/src/widgets/framework.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/scenes/wait_server/wait_server.dart';
import 'package:worfrontend/game_states/game_state.dart';
import 'package:worfrontend/services/table_service.dart';

class WaitServerState extends GameState {
  WaitServerState();

  @override
  void onLoad() {
    super.onLoad();
    GetIt.I.get<TableService>().createGame();
  }

  @override
  Widget buildUI(BuildContext context) {
    return const WaitServerScene();
  }
}
