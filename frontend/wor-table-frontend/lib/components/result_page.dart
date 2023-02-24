import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/network/models/models/result.dart';

import '../constants.dart';

class ResultPage extends StatelessWidget {
  final List<Result> results;

  const ResultPage({Key? key, required this.results}) : super(key: key);

  // Create a layout for displaying child with a rotation of 180, then the center parameter and finally the child with a normal rotation
  renderBothDirection(Widget center, Widget child) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        RotatedBox(
          quarterTurns: 2,
          child: center,
        ),
        center,
        child
      ],
    );
  }

  List<String> getRanking() {
    results.sort((a, b) => a.rank.compareTo(b.rank));
    return results.map((e) => "${e.rank} - ${e.idPlayer} (${e.cattleHeads})").toList();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: BACKGROUND_TABLE_COLOR_1,
      child: Center(
        child: renderBothDirection(Container(), Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ...getRanking().map((e) => Text(e, style: const TextStyle(color: Colors.white))).toList(),
            const SizedBox(height: 20),
            ElevatedButton(onPressed: () {}, child: const Text("Restart"))
          ],
        ),
      )),
    );
  }
}
