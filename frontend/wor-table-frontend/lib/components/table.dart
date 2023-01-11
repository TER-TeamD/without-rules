import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get_it/get_it.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/stacks.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/network/models/stack_card.dart';
import '../services/error_manager.dart';
import 'player_deck/player_deck_state.dart';

class TableComponent extends StatefulWidget {
  final TableGameController game;

  const TableComponent({Key? key, required this.game}) : super(key: key);

  @override
  State<TableComponent> createState() => _TableComponentState();
}

class _TableComponentState extends State<TableComponent> {
  late Map<String, PlayerDeckState> decks;
  late List<StackCard> stacks;
  late GameStates state;

  @override
  void initState() {
    super.initState();
    decks = widget.game.decks;
    stacks = widget.game.stacks;
    state = widget.game.state;

    GetIt.I.get<ErrorManager>().onError.listen((event) {
      print("Error: $event");
      showDialog(context: context, builder: (context) => AlertDialog(content: Text(event.screenMessage())));
    });

    widget.game.decks$.listen((value) => setState(() {
      print("Decks changed (count: ${value.length})");
          decks = value;
        }));
    widget.game.stacks$.listen((value) => setState(() {
          stacks = value;
        }));
    widget.game.state$.listen((value) => setState(() {
          state = value;
        }));
  }

  Widget logDecks(BuildContext context) {
    return Column(
      children: decks.entries.map((e) => Text(e.key, style: const TextStyle(color: Colors.white))).toList(),
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

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black,
      child: Stack(children: [
        logDecks(context),
        Decks(states: decks),
        StacksComponent(stacks: stacks),
        startButton()
      ]),
    );
  }
}
