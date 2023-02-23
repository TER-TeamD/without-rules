import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/components/screen_initializer.dart';
import 'package:worfrontend/components/table.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/models/game.dart';
import 'package:worfrontend/services/tester.dart';

import '../constants.dart';
import '../services/logger.dart';
import '../services/network/socket_gateway.dart';
import '../services/screen_service.dart';

class TableLoader extends StatefulWidget {
  const TableLoader({Key? key}) : super(key: key);

  @override
  State<TableLoader> createState() => _TableLoaderState();
}

class _TableLoaderState extends State<TableLoader> {
  GameController? controller;

  @override
  void initState() {
    super.initState();
    GetIt.I.get<SocketGateway>().newGame().then((game) => setState(() {

          controller = GameController(game, GetIt.I.get<SocketGateway>());

          var transforms = GetIt.I.get<ScreenService>().getMapPosition(
              game.players.map((e) => e.id).toList(growable: false));
          controller!.setDeckTransforms(transforms);

          if(TESTERS != 0) {
            var durations = [ 500, 1000 ];


            // Start the game once every testers are connected.
            StreamSubscription<Game>? subscription;
            subscription = controller!.game$.listen((game) {
              if(game.players.where((p) => p.isLogged).length == TESTERS) {
                subscription?.cancel();
                controller!.startGame();
              }
            });

            // Start the testers.
            for(int i = 0; i < TESTERS; i++) {
              Logger.log("=======>" + game.players[i].id);
              MobileTester(game.players[i].id, HOSTNAME, controller!, latency: durations[i % durations.length]);
            }
          }
        }));
  }

  @override
  Widget build(BuildContext context) {
    return ScreenInitializer(child: controller == null
        ? const Center(child: CircularProgressIndicator())
        : TableComponent(controller: controller!),
    );
  }
}
