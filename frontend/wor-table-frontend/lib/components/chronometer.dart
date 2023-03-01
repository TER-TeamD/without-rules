import 'dart:async';

import 'package:flutter/material.dart';
import 'package:worfrontend/services/game_controller.dart';
import 'package:worfrontend/services/logger.dart';
import 'package:worfrontend/services/network/models/chronometer_data.dart';

class Chronometer extends StatefulWidget {

  final GameController controller;

  const Chronometer({Key? key, required this.controller}) : super(key: key);

  @override
  State<Chronometer> createState() => _ChronometerState();
}

class _ChronometerState extends State<Chronometer> {
  late Timer timer;
  ChronometerData? data;

  @override
  void initState() {
    timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if(mounted) setState(() {});
    });

    widget.controller.chronometer$.listen((event) {
      setState(() {
        data = event;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    if(data?.endTime.isBefore(DateTime.now()) ?? true)  {
      return Container();
    }

    return Stack(
      alignment: Alignment.center,
      children: [
        SizedBox(
          width: 50,
          height: 50,
          child: CircularProgressIndicator(
            value: 1.0 - (DateTime.now().difference(data!.startTime).inSeconds * 1.0 / data!.interval.inSeconds),
            color: Colors.white
          ),
        ),
        Text("${data!.endTime.difference(DateTime.now()).inSeconds}s", style: const TextStyle(color: Colors.white),)
      ],
    );
  }
}
