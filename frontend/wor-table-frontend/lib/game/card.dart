import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:worfrontend/models/card_model.dart';

class GameCard extends StatelessWidget {
  final CardModel card;

  const GameCard({super.key, required this.card});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(20)),
          color: Color.fromARGB(255, 222, 222, 222),
          boxShadow: [
            BoxShadow(
                color: Color.fromARGB(191, 146, 146, 146),
                spreadRadius: 2,
                blurRadius: 7,
                offset: Offset(0, 3))
          ]),
      child: SizedBox(
        width: 200,
        height: 300,
        child: Column(children: [
          Text(card.value.toString()),
          Flexible(child: Center(child: Text(card.value.toString()))),
          RotatedBox(quarterTurns: 2, child: Text(card.value.toString())),
        ]),
      ),
    );
  }
}
