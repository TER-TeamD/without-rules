import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/network/models/chronometer_data.dart';

class Chronometer extends StatefulWidget {
  final ChronometerData data;

  const Chronometer({Key? key, required this.data}) : super(key: key);

  @override
  State<Chronometer> createState() => _ChronometerState();
}

class _ChronometerState extends State<Chronometer> {
  @override
  Widget build(BuildContext context) {
    return Text("Remaining time: ${(widget.data.interval - (DateTime.now().difference(widget.data.startTime))).inSeconds} seconds");
  }
}
