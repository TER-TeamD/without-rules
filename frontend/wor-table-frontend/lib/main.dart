import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:socket_io_client/socket_io_client.dart';
import 'package:worfrontend/components/error_handler.dart';
import 'package:worfrontend/components/table_loader.dart';
import 'package:worfrontend/constants.dart';
import 'package:worfrontend/services/error_manager.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/socket_gateway.dart';
import 'package:worfrontend/services/screen_service.dart';

import 'constants.dart';

void main() {

  String urlSocket = PROD ? "https://backend-ter.cryptoservice.tech/" : "ws://localhost:8451";

  var socket = io(urlSocket, <String, dynamic>{
    'auth': <String, dynamic>{'id': 0, 'type': "TABLE"}
  });

  var socketGateway = SocketGateway(socket);

  socketGateway.listenEvents();

  GetIt.I.registerSingleton(socketGateway);

  var screenService = ScreenService();
  GetIt.I.registerSingleton(screenService);

  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  GameController? controller;
  final ErrorManager _errorManager = ErrorManager();

  @override
  void initState() {
    super.initState();
    GetIt.I.registerSingleton(_errorManager);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [BACKGROUND_TABLE_COLOR_1, BACKGROUND_TABLE_COLOR_2],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: ErrorHandler(errorManager: _errorManager, child: TableLoader()),
      ),
    ));
  }
}
