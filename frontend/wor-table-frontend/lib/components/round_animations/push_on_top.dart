import 'dart:ui';

import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/services/network/models/card.dart';

class PushOnTop extends StatefulWidget {
  final DeckTransform destination;
  final DeckTransform departure;
  final GameCard card;

  const PushOnTop(
      {Key? key,
      required this.destination,
      required this.departure,
      required this.card})
      : super(key: key);

  @override
  State<PushOnTop> createState() => _PushOnTopState();
}

class _PushOnTopState extends State<PushOnTop>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: const Duration(seconds: 1), vsync: this);
    _controller.addListener(() {
      setState(() {});
    });
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var location = Offset.lerp(widget.departure.position,
        widget.destination.position, _controller.value);
    var rotation = lerpDouble(widget.departure.rotation,
        widget.destination.rotation, _controller.value);

    if (location == null) throw 'Unexpected null location.';
    if (rotation == null) throw 'Unexpected null rotation.';

    return Transform.translate(
        offset: location,
        child: Transform.rotate(
            angle: rotation, child: CardComponent(card: widget.card)));
  }
}
