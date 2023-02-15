Duration parse(String iso) {
  return Duration(milliseconds: DateTime.parse(iso).millisecondsSinceEpoch);
}
