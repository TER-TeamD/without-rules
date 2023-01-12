import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/round_animations/push_on_top.dart';
import 'package:worfrontend/components/stacks.dart';
import 'package:worfrontend/models/animations.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/card.dart';
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


  void playAnimation(GameAnimation animation) {
    if(animation is PushOnTopAnimationData) {
      var instance = stacks.singleWhere((element) => element.stack.stackNumber == animation.stack.stackNumber, orElse: () => throw "Stack not found for playing animation.");
      var renderBox = instance.key.currentContext?.findRenderObject() as RenderBox?;
      if(renderBox == null) throw "Unable to get renderbox of the stack";
      var position = renderBox.localToGlobal(Offset.zero);

      var departureDeck = widget.game.getPlayerDeckState(animation.playerId);
      var departure = departureDeck.transform;

      setState(() {
        currentAnimation = PushOnTop(destination: DeckTransform(position, 0), departure: departure, card: animation.card);
      });
    }
  }


  @override
  void initState() {
    super.initState();
    decks = widget.game.decks;
    stacks = widget.game.stacks.map((e) => StackViewInstance(e)).toList();
    state = widget.game.state;

    GetIt.I.get<ErrorManager>().onError.listen((event) {
      print("Error: $event");
      showDialog(context: context, builder: (context) => AlertDialog(content: Text(event.screenMessage())));
    });

    widget.game.decks$.listen((value) => setState(() {
      print("Decks changed (count: ${value.length})");
          decks = value;
          testAnimation();
        }));
    widget.game.stacks$.listen((value) => setState(() {
          stacks = value.map((e) => StackViewInstance(e)).toList();
          testAnimation();

    }));
    widget.game.state$.listen((value) => setState(() {
          state = value;
          testAnimation();

    }));
  }

  bool alreadyCalled = false;

  void testAnimation() {
    if(currentAnimation != null) return;
    if(stacks.length == 0) return;
    if(decks.length == 0) return;
    if(!alreadyCalled) {
      alreadyCalled = true;
      return;
    }

    if(currentAnimation == null) {
      playAnimation(PushOnTopAnimationData(GameCard(55, 5), stacks.first.stack, decks.first.playerId, GameAnimations.pushOnTop));
    }
  }

  Widget logDecks(BuildContext context) {
    return Column(
      children: decks.map((e) => Text(e.playerId, style: const TextStyle(color: Colors.white))).toList(),
    );
  }
  Widget startButton() {
    if(state == GameStates.waitPlayers) {
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
    if(currentAnimation == null) return Container();
    return Container();
  }

  @override
  Widget build(BuildContext context) {
    GetIt.I.get<ScreenService>().setScreenSize(context);

    return Container(
      color: Colors.black,
      child: Stack(children: [
        logDecks(context),
        Decks(states: decks),
        StacksComponent(stacks: stacks),
        startButton(),
        drawAnimation(),
      ]),
    );
  }
}
