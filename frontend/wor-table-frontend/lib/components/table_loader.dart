import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/components/screen_initializer.dart';
import 'package:worfrontend/components/table.dart';
import 'package:worfrontend/services/game_controller.dart';

import '../services/network/socket_gateway.dart';

class TableLoader extends StatefulWidget {
  const TableLoader({Key? key}) : super(key: key);

  @override
  State<TableLoader> createState() => _TableLoaderState();
}

class _TableLoaderState extends State<TableLoader> {
  GameControllers? controllers;

  @override
  void initState() {
    super.initState();
    GetIt.I.get<SocketGateway>().newGame().then((game) => setState(() {
          controllers = GameControllers(game, GetIt.I.get<SocketGateway>());
        }));
  }

  @override
  Widget build(BuildContext context) {
    return ScreenInitializer(child: controllers == null
        ? const Center(child: CircularProgressIndicator())
        : TableComponent(controller: controllers!.tableGameController));
  }
}
