import 'package:flutter/cupertino.dart';
import 'package:flutter/widgets.dart';

class CardBack extends StatelessWidget {
  const CardBack({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: const SizedBox(
        child: Icon(
          CupertinoIcons.check_mark_circled_solid,
          color: Color.fromRGBO(204, 255, 205, 1.0),
          size: 60.0,
        ),
      )
    );
  }
}
