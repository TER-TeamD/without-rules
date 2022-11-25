import 'package:flutter/cupertino.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:worfrontend/game/card.dart';
import 'package:worfrontend/models/card_queue_model.dart';

class Queue extends StatelessWidget {
  final CardQueueModel queue;

  const Queue({super.key, required this.queue});

  @override
  Widget build(BuildContext context) {
    return Stack(
        children: Iterable<int>.generate(queue.cards.length)
            .map((i) => Column(
                  children: [
                    SizedBox(height: i * 20),
                    GameCard(card: queue.cards[i]),
                  ],
                ))
            .toList());
  }
}
