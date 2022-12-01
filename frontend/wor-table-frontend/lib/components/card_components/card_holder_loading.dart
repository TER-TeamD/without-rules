import 'package:flutter/material.dart';

class CardHolderLoading extends StatelessWidget {
  const CardHolderLoading({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: const BoxDecoration(
            color: Color.fromARGB(255, 244, 244, 244),
            borderRadius: BorderRadius.all(Radius.circular(5))),
        child: const SizedBox(
            width: 100,
            height: 150,
            child: Center(child: CircularProgressIndicator())));
  }
}
