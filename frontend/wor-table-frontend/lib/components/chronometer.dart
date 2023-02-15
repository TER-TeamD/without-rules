import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:worfrontend/services/network/models/chronometer_data.dart';

class Chronometer extends StatefulWidget {
  final ChronometerData data;

  const Chronometer({Key? key, required this.data}) : super(key: key);

  @override
  State<Chronometer> createState() => _ChronometerState();
}

class _ChronometerState extends State<Chronometer> {
  late Timer timer;

  @override
  void initState() {
    timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {

      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        SizedBox(
          width: 50,
          height: 50,
          child: CircularProgressIndicator(
            value: 1.0 - (DateTime.now().difference(widget.data.startTime).inSeconds * 1.0 / widget.data.interval.inSeconds),
            color: Colors.white
          ),
        ),
        Text("${widget.data.endTime.difference(DateTime.now()).inSeconds}s", style: TextStyle(color: Colors.white),)
      ],
    );
  }
}
