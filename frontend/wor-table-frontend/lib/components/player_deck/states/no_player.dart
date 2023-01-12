import 'package:flutter/material.dart';
import 'package:worfrontend/components/player_deck/player_deck_state.dart';

class DeckNoPlayer extends PlayerDeckState {
  final String id;

  DeckNoPlayer({Key? key, required this.id});

  @override
  build(BuildContext context) {
    return AddPlayerWizard(id: id);
  }
}

class AddPlayerWizard extends StatefulWidget {
  final String id;

  const AddPlayerWizard({Key? key, required this.id}) : super(key: key);

  @override
  State<AddPlayerWizard> createState() => _AddPlayerWizardState();
}

class _AddPlayerWizardState extends State<AddPlayerWizard> {
  bool opened = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    if (opened) {
      return Text(widget.id, style: const TextStyle(color: Colors.white));
    } else {
      return ElevatedButton(
          onPressed: () => setState(() {
                opened = true;
              }),
          child: const Text("Join game"));
    }
  }
}
