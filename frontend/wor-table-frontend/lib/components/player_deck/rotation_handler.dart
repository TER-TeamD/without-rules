import 'package:flutter/material.dart';

class RotationHandler extends StatelessWidget {
  final void Function(Offset delta)? rotationUpdate;
  final void Function()? rotationStart;
  final void Function()? rotationEnd;

  const RotationHandler(
      {Key? key, this.rotationStart, this.rotationUpdate, this.rotationEnd})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onPanStart: (details) {
        rotationStart?.call();
      },
      onPanUpdate: (details) {
        rotationUpdate?.call(details.localPosition);
      },
      onPanEnd: (details) {
        rotationEnd?.call();
      },
      child: const SizedBox(
        width: 20,
        height: 20,
        child: Icon(Icons.rotate_left, size: 20, color: Colors.white),
      ),
    );
  }
}
