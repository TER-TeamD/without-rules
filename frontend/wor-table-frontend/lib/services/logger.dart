import 'package:worfrontend/constants.dart';

class Logger {

  static log(String text) {
    String header = DateTime.now().toIso8601String();

    if(SHOW_LOG_SOURCE) {
      var currentStackTrace = StackTrace.current;
      var callerTrace = currentStackTrace.toString().split("\n").where((l) => l.startsWith("packages/worfrontend/")).elementAt(1).split(" ");
      var callerFile = callerTrace[0].trim();
      var callerLine = callerTrace[1];

      header += ", $callerFile:$callerLine";
    }

    print("$header | $text");
  }

  static space() {
    print("");
  }
}
