import 'package:rxdart/subjects.dart';

class ChronometerData {
  final DateTime startTime = DateTime.now();
  final DateTime endTime;

  Duration get interval => endTime.difference(startTime);
  BehaviorSubject<bool> isAlert$ = BehaviorSubject.seeded(false);

  ChronometerData(this.endTime) {
    Future.delayed(interval - const Duration(seconds: 9, milliseconds: 950),
        () {
      isAlert$.add(isAlert);
      Future.delayed(const Duration(seconds: 10, milliseconds: 50),
          () => isAlert$.add(isAlert));
    });
  }

  bool get isAlert => endTime.isBefore(DateTime.now())
      ? false
      : endTime
        .subtract(const Duration(seconds: 10))
        .isBefore(DateTime.now());
}
