import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';

class PlayerSpot extends StatelessWidget {
  final Widget child;
  final Offset position;
  final int orientation;

  const PlayerSpot(
      {super.key,
      required this.child,
      required this.position,
      this.orientation = 0});

  @override
  Widget build(BuildContext context) {
    var p = position;
    if (orientation % 2 == 0) {
      p = p.translate(-CardComponent.size.dx / 2, -CardComponent.size.dy / 2);
    } else {
      p = p.translate(-CardComponent.size.dy / 2, -CardComponent.size.dx / 2);
    }
    return Positioned(
        top: p.dy,
        left: p.dx,
        child: RotatedBox(quarterTurns: orientation, child: child));
  }
}
