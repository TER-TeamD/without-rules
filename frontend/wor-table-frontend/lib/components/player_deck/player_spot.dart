import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'dart:math' as math;

class PlayerSpot extends StatefulWidget {
  final Widget child;
  final Offset position;
  final double rotation;

  const PlayerSpot(
      {Key? key,
      required this.child,
      required this.position,
      this.rotation = 0})
      : super(key: key);

  @override
  State<PlayerSpot> createState() => _PlayerSpotState();
}

class _PlayerSpotState extends State<PlayerSpot> {
  Offset position = Offset.zero;
  double rotation = 0;
  double startRotation = 0;
  Offset startDelta = Offset.zero;

  @override
  void initState() {
    super.initState();
    position = widget.position;
    rotation = widget.rotation;
  }

  Widget rotationHandler() {
    return Container(
        color: Colors.green,
        child: GestureDetector(
          onTap: () => setState(() {
            rotation = (rotation + math.pi / 2) % (2 * math.pi);
          }),
          onPanStart: (details) {
            startRotation = rotation;
          },
          onPanUpdate: (details) {
            var deltaFromCenter = details.localPosition -
                Offset(0, CardComponent.size.dy / 2 - 10);
            // Calculate angle in order to always point toward the mouse
            var angle = math.atan2(deltaFromCenter.dy, deltaFromCenter.dx) +
                startRotation +
                math.pi / 2;
            setState(() {
              rotation = angle;
            });
          },
          child: SizedBox.square(
            dimension: 10,
            child: Text("     "),
          ),
        ));
  }

  Widget content() {
    return Container(
        color: Colors.grey,
        child: SizedBox(
            width: CardComponent.size.dx,
            height: CardComponent.size.dy,
            child: Center(child: widget.child)));
  }

  Widget makeRotatable(Widget child) {
    return Stack(children: [
      child,
      Transform.translate(
          offset: Offset(CardComponent.size.dx / 2 - 5, 10),
          child: rotationHandler())
    ]);
  }

  @override
  Widget build(BuildContext context) {
    var p = position;

    return Positioned(
      top: p.dy,
      left: p.dx,
      child: Transform.translate(
          offset: -Offset(CardComponent.size.dx / 2, CardComponent.size.dy / 2),
          child: Transform.rotate(
              angle: rotation,
              child: makeRotatable(
                GestureDetector(
                    onScaleStart: (details) {
                      startDelta = position - details.focalPoint;
                    },
                    onScaleUpdate: (details) {
                      setState(() {
                        if (details.pointerCount != 1) {
                          rotation = details.rotation;
                        }
                        position = details.focalPoint + startDelta;
                      });
                    },
                    child: content()),
              ))),
    );
  }
}
