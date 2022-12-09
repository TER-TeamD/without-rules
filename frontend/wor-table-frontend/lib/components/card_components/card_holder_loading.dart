import 'package:flutter/material.dart';
import 'package:worfrontend/components/card_components/card_component.dart';

class CardHolderLoading extends StatelessWidget {
  const CardHolderLoading({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: const BoxDecoration(
            color: Color.fromARGB(255, 244, 244, 244),
            borderRadius: BorderRadius.all(Radius.circular(5))),
        child: SizedBox(
            width: CardComponent.size.dx,
            height: CardComponent.size.dy,
            child: const Center(child: CircularProgressIndicator())));
  }
}
