import 'package:flutter/cupertino.dart';
import 'package:flutter/widgets.dart';

import '../../constants.dart';

class CardBack extends StatelessWidget {
  const CardBack({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: const SizedBox(
        child: Icon(
          CupertinoIcons.check_mark_circled_solid,
          color: VALIDATE_ACTION_ON_CARD_ICON_COLOR,
          size: 60.0,
        ),
      )
    );
  }
}
