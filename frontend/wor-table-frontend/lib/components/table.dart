import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/round_animations/push_on_top.dart';
import 'package:worfrontend/components/stacks.dart';
import 'package:worfrontend/models/animations.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/screen_service.dart';

import '../services/error_manager.dart';

class TableComponent extends StatefulWidget {
  final TableGameController controller;

  const TableComponent({Key? key, required this.controller}) : super(key: key);

  @override
  State<TableComponent> createState() => _TableComponentState();
}

class _TableComponentState extends State<TableComponent> {
  late Map<String, PositionedPlayerDeckState> decks;
  late List<StackViewInstance> stacks;
  bool isGameStarted = false;
  PlayerActionPlayer? playerActionPlayer;

  @override
  void initState() {
    super.initState();
    decks = widget.controller.getDecks();
    stacks = widget.controller
        .getStacks()
        .map((e) => StackViewInstance(e))
        .toList(growable: false);
    isGameStarted = widget.controller.isGameStarted();

    widget.controller.gameChanged$.listen((value) {
      setState(() {
        decks = widget.controller.getDecks();
        stacks = widget.controller
            .getStacks()
            .map((e) => StackViewInstance(e))
            .toList(growable: false);
        isGameStarted = widget.controller.isGameStarted();
        playerActionPlayer = widget.controller.getCurrentPlayerActionPlayer();
      });
    });

    GetIt.I.get<ErrorManager>().onError.listen((event) {
      Logger.log("Error: $event");
      showDialog(
          context: context,
          builder: (context) =>
              AlertDialog(content: Text(event.screenMessage())));
    });
  }

  bool alreadyCalled = false;

  Widget logDecks(BuildContext context) {
    return Column(
      children: decks.entries
          .map((e) => e.value)
          .map((e) =>
              Text(e.playerId, style: const TextStyle(color: Colors.white)))
          .toList(),
    );
  }

  Widget startButton() {
    if (!isGameStarted) {
      return Center(
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.all(50.0),
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            backgroundColor: Colors.green
          ),
          onPressed: () => widget.controller.startGame(),
          child: const Text("Start game"),
        ),
      );
    } else {
      return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    GetIt.I.get<ScreenService>().setScreenSize(context);

    var result = Container(

      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color.fromRGBO(253, 251, 251, 1), Color.fromRGBO(235, 237, 238, 1)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),

      child: Stack(children: [
        logDecks(context),
        Decks(states: decks.entries.map((e) => e.value).toList(growable: false)),
        StacksComponent(stacks: stacks),
        startButton(),
        ...(playerActionPlayer?.buildWidget(
                context,
                SceneData(
                    stacks,
                    Map.fromEntries(decks.entries
                        .map((e) => MapEntry(e.key, e.value.transform))))) ?? [])
      ]),
    );

    return result;
  }
}
