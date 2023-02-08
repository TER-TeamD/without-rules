import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/decks.dart';

class SlideCard extends StatefulWidget {
  final DeckTransform from;
  final DeckTransform to;
  final Widget child;
  final void Function()? onDone;

  const SlideCard({ Key? key, required this.from, required this.to, required this.child, this.onDone }) : super(key: key);

  @override
  State<SlideCard> createState() => _SlideCardState();
}

class _SlideCardState extends State<SlideCard> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 2));
    _controller.forward(from: 0);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var position = Tween<Offset>(begin: widget.from.position, end: widget.to.position).animate(_controller);
    var rotation = Tween<double>(begin: widget.from.rotation, end: widget.to.rotation).animate(_controller);

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.translate(
          offset: position.value,
          child: Transform.rotate(
            angle: rotation.value,
            child: child,
          ),
        );
      },
      child: widget.child,
    );
  }
}
