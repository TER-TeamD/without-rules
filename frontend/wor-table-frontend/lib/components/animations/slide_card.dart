import 'package:flutter/widgets.dart';
import 'package:worfrontend/components/decks.dart';
import 'package:worfrontend/models/transform.dart';

class SlideCardData {
  final AppTransform from;
  final AppTransform to;
  final Widget child;

  const SlideCardData({ required this.from, required this.to, required this.child});
}

class SlideCard extends StatefulWidget {
  final String id;
  final SlideCardData Function() retrieveData;
  final void Function()? onDone;

  const SlideCard({ Key? key, required this.id, required this.retrieveData, this.onDone }) : super(key: key);

  @override
  State<SlideCard> createState() => _SlideCardState(id);
}

class _SlideCardState extends State<SlideCard> with SingleTickerProviderStateMixin {
  final String id;

  late AnimationController _controller;

  _SlideCardState(this.id);

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 2));
    _controller.addListener(() {
      if(_controller.isCompleted) {
        widget.onDone?.call();
      }
    });
    _controller.reset();
    _controller.forward(from: 0);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(covariant SlideCard oldWidget) {
    super.didUpdateWidget(oldWidget);

    if(oldWidget.id != widget.id) {
      _controller.reset();
      _controller.forward(from: 0);
    }
  }

  @override
  Widget build(BuildContext context) {


    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        var data = widget.retrieveData();
        var transform = Tween<AppTransform>(begin: data.from, end: data.to).animate(_controller);
        return Transform.translate(
          offset: transform.value.position,
          child: Transform.rotate(
            angle: transform.value.rotation,
            child: data.child,
          ),
        );
      },
      child: Container(),
    );
  }
}
