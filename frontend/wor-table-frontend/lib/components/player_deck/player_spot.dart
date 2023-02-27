import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/components/player_deck/rotation_handler.dart';
import 'package:worfrontend/models/transform.dart';

import '../../constants.dart';

class PlayerSpot extends StatefulWidget {
  final Widget child;
  final Widget childBottom;
  final Offset position;
  final double rotation;
  final void Function(AppTransform)? positionChanged;

  const PlayerSpot(
      {
        Key? key,
        required this.child,
        required this.position,
        required this.childBottom,
        this.rotation = 0,
        this.positionChanged,
      })
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

  Widget content() {
    return Container(
        decoration: BoxDecoration(
          color: CARD_BACKGROUND_COLOR,
          border: Border.all(
            color: CARD_BORDER_COLOR,
            width: 4.0,
          ),
          borderRadius: const BorderRadius.all(Radius.circular(5.0)),
        ),
        child: SizedBox(
            width: CardComponent.size.dx,
            height: CardComponent.size.dy,
            child: Center(
                child: widget.child
            )
        )
    );
  }

  Widget rotationHandler() {
    return RotationHandler(
      rotationStart: () {
        startRotation = rotation;
      },
      rotationUpdate: (localPosition) {
        setState(() {
          var deltaFromCenter =
              localPosition - Offset(0, CardComponent.size.dy / 2 + 30);
          // Calculate angle in order to always point toward the mouse
          var angle = math.atan2(deltaFromCenter.dy, deltaFromCenter.dx) +
              startRotation +
              math.pi / 2;
          setState(() {
            rotation = angle % (2 * math.pi);
          });
        });
      },
      rotationEnd: () {
        widget.positionChanged?.call(AppTransform(position, rotation));
      },
    );
  }

  @override
  void didUpdateWidget(covariant PlayerSpot oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.position != widget.position) {
      position = widget.position;
    }
    if (oldWidget.rotation != widget.rotation) {
      rotation = widget.rotation;
    }
  }

  @override
  Widget build(BuildContext context) {
    var p = position;

    return Positioned(
      top: p.dy,
      left: p.dx,
      child: Transform.translate(
          offset: -Offset(
              CardComponent.size.dx / 2, CardComponent.size.dy / 2 - 15),
          child: Transform.rotate(
              angle: rotation,
              child: SizedBox(
                width: CardComponent.size.dx,
                height: CardComponent.size.dy + 30,
                child: Stack(
                  children: [
                    Transform.translate(
                        offset: Offset(CardComponent.size.dx / 2 - 10, 0),
                        child: rotationHandler()),
                    Transform.translate(
                      offset: const Offset(0, 30),
                      child: GestureDetector(
                          onScaleStart: (details) {
                            startDelta = position - details.focalPoint;
                          },
                          onScaleUpdate: (details) {
                            setState(() {
                              if (details.pointerCount != 1) {
                                rotation = details.rotation % (2 * math.pi);
                              }
                              position = details.focalPoint + startDelta;
                            });
                          },
                          onScaleEnd: (_) {
                            widget.positionChanged
                                ?.call(AppTransform(position, rotation));
                          },
                          child: content()),
                    ),
                    Transform.translate(
                        offset: Offset(0, CardComponent.size.dy + 40),
                        child: Container(
                          height: 70.0,
                          // decoration: BoxDecoration(color: Color.fromRGBO(68, 68, 68, 1.0),),
                          child: widget.childBottom,
                        )
                    ),
                  ],
                ),
              )
          )
      ),
    );
  }
}
