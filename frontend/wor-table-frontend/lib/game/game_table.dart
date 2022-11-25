import 'package:flutter/cupertino.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:worfrontend/game/queue.dart';
import 'package:worfrontend/models/card_queue_model.dart';
import 'package:worfrontend/models/game_model.dart';

class GameTable extends StatelessWidget {
  final GameModel game;

  const GameTable({super.key, required this.game});

  Widget buildQueue(BuildContext context, CardQueueModel queue) {
    return Queue(queue: queue);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Stack(
        children: [
          Center(
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: Iterable<int>.generate(game.queues.length)
                      .expand((i) => i == 0
                          ? [buildQueue(context, game.queues[i])]
                          : [
                              const SizedBox(width: 30),
                              buildQueue(context, game.queues[i])
                            ])
                      .toList()))
        ],
      ),
    );
  }
}
