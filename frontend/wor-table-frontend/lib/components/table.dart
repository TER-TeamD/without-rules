import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/round_animations/push_on_top.dart';
import 'package:worfrontend/components/stacks.dart';
import 'package:worfrontend/models/animations.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/screen_service.dart';

import '../services/error_manager.dart';

class TableComponent extends StatefulWidget {
  final TableGameController game;

  const TableComponent({Key? key, required this.game}) : super(key: key);

  @override
  State<TableComponent> createState() => _TableComponentState();
}

class _TableComponentState extends State<TableComponent> {
  late List<PositionedPlayerDeckState> decks;
  late List<StackViewInstance> stacks;
  late GameStates state;

  Widget? currentAnimation;

  Widget? buildPlayable(GameAnimation animation) {
    Logger.log("Playing animation");
    if (animation is PushOnTopAnimationData) {

      Logger.log("Push on top animation");

      var departureDeck = widget.game.getPlayerDeckState(animation.playerId);
      var departure = departureDeck.transform;

      return PushOnTop(
          destination: stacks.firstWhere((element) => element.stack.stackNumber == animation.stack.stackNumber).key,
          departure: departure,
          card: animation.card,
          onComplete: () => widget.game.animationComplete(animation));
    }
    return null;
  }

  @override
  void initState() {
    super.initState();
    decks = widget.game.decks;
    stacks = widget.game.stacks.map((e) => StackViewInstance(e)).toList();
    state = widget.game.state;

    GetIt.I.get<ErrorManager>().onError.listen((event) {
      Logger.log("Error: $event");
      showDialog(
          context: context,
          builder: (context) =>
              AlertDialog(content: Text(event.screenMessage())));
    });

    widget.game.decks$.listen((value) => setState(() {
          Logger.log("Decks changed (count: ${value.length})");
          decks = value;
        }));
    widget.game.stacks$.listen((value) => setState(() {
      stacks = value.map((e) => StackViewInstance(e)).toList();
    }));
    widget.game.state$.listen((value) => setState(() {
          state = value;
        }));
    widget.game.currentAnimation$.listen((value) {
      if (value == null) {
        setState(() {
          currentAnimation = null;
        });
      } else {
        setState(() {
          currentAnimation = buildPlayable(value);
        });
      }
    });
  }


  bool alreadyCalled = false;

  Widget logDecks(BuildContext context) {
    return Column(
      children: decks
          .map((e) =>
              Text(e.playerId, style: const TextStyle(color: Colors.white)))
          .toList(),
    );
  }

  Widget startButton() {
    if (state == GameStates.waitPlayers) {
      return Center(
        child: ElevatedButton(
          onPressed: () => widget.game.startGame(),
          child: const Text("Start game"),
        ),
      );
    } else {
      return const SizedBox.shrink();
    }
  }

  Widget drawAnimation() {
    if (currentAnimation == null) {
      Logger.log("No animation");
      return Container();
    }
    return currentAnimation!;
  }

  @override
  Widget build(BuildContext context) {
    GetIt.I.get<ScreenService>().setScreenSize(context);

    var result = Container(
      color: Colors.black,
      child: Stack(children: [
        logDecks(context),
        Decks(states: decks),
        StacksComponent(stacks: stacks),
        startButton(),
        drawAnimation(),
      ]),
    );

    return result;
  }
}
