import 'dart:ui';

import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/card_components/card_component.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/network/models/card.dart';

class PushOnTop extends StatefulWidget {
  final GlobalKey destination;
  final DeckTransform departure;
  final GameCard card;
  final void Function()? onComplete;

  const PushOnTop(
      {Key? key,
      required this.destination,
      required this.departure,
      required this.card,
      this.onComplete})
      : super(key: key);

  @override
  State<PushOnTop> createState() => _PushOnTopState();
}

class _PushOnTopState extends State<PushOnTop>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void didUpdateWidget(covariant PushOnTop oldWidget) {
    super.didUpdateWidget(oldWidget);
    _controller.reset();
    _controller.forward();
  }

  @override
  void initState() {
    super.initState();
    _controller =
        AnimationController(duration: const Duration(seconds: 1), value: 0, vsync: this);
    _controller.addListener(() {
      setState(() {});
      if(_controller.isCompleted) {
        Logger.log("Animation complete");
        widget.onComplete?.call();
      }
    });
    _controller.reset();
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context)
  {

    var destinationRenderBox = widget.destination.currentContext?.findRenderObject() as RenderBox?;
    if(destinationRenderBox == null) return Container();
    var destinationPosition = destinationRenderBox?.localToGlobal(Offset.zero);


    var location = Offset.lerp(widget.departure.position,
        destinationPosition, _controller.value);
    var rotation = lerpDouble(widget.departure.rotation,
        0, _controller.value);

    if (location == null) throw 'Unexpected null location.';
    if (rotation == null) throw 'Unexpected null rotation.';

    return Transform.translate(
        offset: location,
        child: Transform.rotate(
            angle: rotation, child: CardComponent(card: widget.card)));
  }
}
