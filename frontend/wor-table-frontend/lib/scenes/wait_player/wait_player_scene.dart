import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/scenes/wait_player/player_stand_init.dart';
import 'package:worfrontend/services/game_states/wait_players.dart';
import 'package:worfrontend/services/network/network_service.dart';

import '../../errors/too_much_player.dart';

class WaitPlayerScene extends StatefulWidget {
  final WaitPlayerState gameState;

  const WaitPlayerScene({super.key, required this.gameState});

  @override
  State<WaitPlayerScene> createState() => _WaitPlayerSceneState();
}

class _WaitPlayerSceneState extends State<WaitPlayerScene> {
  @override
  initState() {
    super.initState();
    widget.gameState.borrowedObservable.listen((value) {
      setState(() {});
    });
  }

  onTap(BuildContext context, TapDownDetails details) {
    try {
      widget.gameState.borrow(details.globalPosition);
    } on TooMuchPlayer catch (e) {
      showDialog(
          context: context,
          builder: (context) => AlertDialog(
                  title: const Text("There is no more space for new player"),
                  actions: [
                    TextButton(
                        child: const Text("OK"),
                        onPressed: () {
                          Navigator.of(context, rootNavigator: true).pop();
                        })
                  ]));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color.fromARGB(255, 252, 221, 221),
      child: GestureDetector(
          onTapDown: (details) => onTap(context, details),
          child: Container(
            color: const Color.fromARGB(249, 111, 186, 240),
            child: Stack(children: [
              ...widget.gameState.borrowed
                  .map((e) => Positioned(
                      top: e.position.dy - 55,
                      left: e.position.dx - 100,
                      child: PlayerStandInit(ticket: e)))
                  .toList(),
              Center(
                child: TextButton(
                    child: const Text("Start !"),
                    onPressed: () {
                      widget.gameState.setComplete();
                    }),
              )
            ]),
          )),
    );
  }
}
