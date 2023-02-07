import 'package:flutter/material.dart';
import 'package:worfrontend/components/card_components/card_component.dart';

import '../../constants.dart';

class CardHolderLoading extends StatelessWidget {
  const CardHolderLoading({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(

        child: const Center(
            child: CircularProgressIndicator(
              color: CIRCULAR_PROGRESS_ON_CARD_COLOR,
            )
        )
    );
  }
}
