import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/stacks.dart';
import 'package:worfrontend/models/scene_data.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/screen_service.dart';

import '../services/error_manager.dart';

class TableComponent extends StatefulWidget {
  final GameController controller;

  const TableComponent({Key? key, required this.controller}) : super(key: key);

  @override
  State<TableComponent> createState() => _TableComponentState();
}

class _TableComponentState extends State<TableComponent> {
  Map<String, PositionedPlayerDeckState> decks = {};
  late List<StackViewInstance> stacks;
  bool isGameStarted = false;
  bool isGameEnded = false;
  PlayerActionPlayer? playerActionPlayer;

  @override
  void initState() {
    super.initState();
    stacks = widget.controller.getStacks().map((e) => StackViewInstance(e)).toList(growable: false);
    isGameStarted = widget.controller.isGameStarted();

    widget.controller.game$.listen((game) {
      setState(() {
        decks = getDecks(game, widget.controller.getDeckTransforms());
        stacks = widget.controller
            .getStacks()
            .map((e) => StackViewInstance(e))
            .toList(growable: false);
        isGameStarted = widget.controller.isGameStarted();
        playerActionPlayer = widget.controller.getCurrentPlayerActionPlayer();
      });
    });
    widget.controller.gameEnded$.listen((event) {
      setState(() {
        isGameEnded = event;
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
              backgroundColor: Colors.green),
          onPressed: () => widget.controller.startGame(),
          child: const Text("Start game"),
        ),
      );
    } else {
      return const SizedBox.shrink();
    }
  }

  Widget gameEnd() {
    return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
      Text(
        "Game ended",
        style: const TextStyle(color: Colors.white, fontSize: 50),
      ),
      ...widget.controller.getRank().map((p) => Row(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text("${p.gameResult.ranking}", style: const TextStyle(color: Colors.white, fontSize: 26.0,)),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Image.asset(
              'images/avatars/${p.avatar}.png',
              width: 50.0,
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text("${p.username}", style: const TextStyle(color: Colors.white, fontSize: 18.0,),),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text("${p.gameResult.cattleHeads} cattleheads", style: const TextStyle(color: Colors.white,  fontSize: 18.0,),),
          ),
        ],
      )).toList(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    GetIt.I.get<ScreenService>().setScreenSize(context);

    if (isGameEnded) {
      return Center(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            gameEnd(),
            const SizedBox(width: 50),
            RotatedBox(quarterTurns: 2, child: gameEnd())
          ],
        ),
      );
    }

    var result = Stack(children: [
        // logDecks(context),
        Decks(
            states: decks.entries.map((e) => e.value).toList(growable: false)),
        StacksComponent(stacks: stacks, shouldChoose: widget.controller.doUserShouldChoose(), onStackTap: (stack) => widget.controller.chooseStack(stack.stackNumber)),
        startButton(),
        ...(playerActionPlayer?.buildWidget(
                context,
                SceneData(
                    stacks,
                    Map.fromEntries(decks.entries
                        .map((e) => MapEntry(e.key, e.value.transform))))) ??
            [])
      ],
    );

    return result;
  }
}
