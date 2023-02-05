import 'package:flutter/cupertino.dart';
import 'dart:math' as math;
import 'package:worfrontend/services/network/models/card.dart';

class CardComponent extends StatelessWidget {
  static const Offset size = Offset(100, 170);

  final GameCard card;

  const CardComponent({super.key, required this.card});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          color: Color.fromARGB(255, 226, 226, 226),
          borderRadius: BorderRadius.all(Radius.circular(5))),
      child: SizedBox(
          width: size.dx,
          height: size.dy,
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(card.value.toString()),
                        Text(card.value.toString())
                      ]
                  ),

                  Text(
                    "🐮" * card.cattleHead,
                    textAlign: TextAlign.center,
                  ),

                  Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Transform.rotate(
                          angle: math.pi,
                          child: Text(card.value.toString()),
                        ),
                        Transform.rotate(
                          angle: math.pi,
                          child: Text(card.value.toString()),
                        )
                      ]
                  )
                ]
            ),
          )
      ),
    );
  }
}
