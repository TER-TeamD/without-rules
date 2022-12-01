import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/widgets.dart';

class CardBack extends StatelessWidget {
  const CardBack({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: const BoxDecoration(
            color: Color.fromARGB(255, 226, 226, 226),
            borderRadius: BorderRadius.all(Radius.circular(5))),
        child: SizedBox(
          width: 100,
          height: 150,
          child: Container(),
        ));
  }
}
