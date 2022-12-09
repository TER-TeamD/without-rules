import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';

class CardHolder extends StatelessWidget {
  const CardHolder({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: const BoxDecoration(
            color: Color.fromARGB(255, 244, 244, 244),
            borderRadius: BorderRadius.all(Radius.circular(5))),
        child: SizedBox(
            width: CardComponent.size.dx, height: CardComponent.size.dy));
  }
}
