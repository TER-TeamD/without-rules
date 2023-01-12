class Logger {

  static log(String text) {
    print("${DateTime.now().toIso8601String()} | $text");
  }

  static space() {
    print("");
  }
}
