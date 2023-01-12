import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:worfrontend/components/table.dart';
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/socket_gateway.dart';
import 'package:worfrontend/services/screen_service.dart';


void main() {
  var errorManager = ErrorManager();
  var socket = io("ws://localhost:8451", <String, dynamic>{
    'auth': <String, dynamic>{'id': 0, 'type': "TABLE"}
  });

  var socketGateway = SocketGateway(socket);

  socketGateway.listenEvents();

  var controllers = GameControllers.create(socketGateway);


  GetIt.I.registerSingleton(errorManager);
  GetIt.I.registerSingleton(socketGateway);
  GetIt.I.registerSingleton(controllers.socketGameController);
  GetIt.I.registerSingleton(controllers.tableGameController);

  var screenService = ScreenService();
  GetIt.I.registerSingleton(screenService);

  runApp(const MyApp());
}


class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: TableComponent(game: GetIt.I.get<TableGameController>()),
      ),
    );
  }
}
