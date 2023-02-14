import 'package:flutter/material.dart';

class Toast extends StatefulWidget {
  final Widget child;

  const Toast({Key? key, required this.child}) : super(key: key);

  @override
  State<Toast> createState() => _ToastState();
}

class _ToastState extends State<Toast> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 3000));
    _controller.forward(from: 0);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget content() {
    return Center(
      child: FittedBox(
        child: Container(
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(5),
            color: Colors.black,
          ),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: widget.child,
          ),
        ),
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          var opacityTween = TweenSequence<double>([
            TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.0), weight: 1),
            TweenSequenceItem(tween: ConstantTween(1), weight: 5),
            TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.0), weight: 2)
          ]).animate(_controller);
          return Container(
            alignment: Alignment.center,
            child: FadeTransition(
              opacity: opacityTween,
              child: Container(
                  child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  Expanded(
                      child: RotatedBox(quarterTurns: 2, child: content())),
                  Expanded(child: content()),
                ],
              )),
            ),
          );
        });
  }
}
