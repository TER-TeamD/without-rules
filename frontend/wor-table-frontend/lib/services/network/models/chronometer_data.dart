class ChronometerData {
  final DateTime startTime = DateTime.now();
  final DateTime endTime;
  Duration get interval => endTime.difference(startTime);
  bool get expired => DateTime.now().isAfter(endTime);

  ChronometerData(this.endTime);
}
