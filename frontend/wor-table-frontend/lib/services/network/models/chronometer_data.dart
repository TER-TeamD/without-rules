class ChronometerData {
  final DateTime startTime = DateTime.now();
  final DateTime endTime;
  Duration get interval => endTime.difference(startTime);

  ChronometerData(this.endTime);
}
