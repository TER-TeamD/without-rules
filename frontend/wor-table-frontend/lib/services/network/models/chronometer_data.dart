import 'package:rxdart/subjects.dart';

class ChronometerData {
  final DateTime startTime = DateTime.now();
  final DateTime endTime;
  Duration get interval => endTime.difference(startTime);
  BehaviorSubject<bool> isAlert$ = BehaviorSubject.seeded(false);

  ChronometerData(this.endTime) {
    Future.delayed(interval - const Duration(seconds: 10), () {
      isAlert$.add(true);
    });
  }
}
