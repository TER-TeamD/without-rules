import 'dart:convert';

import 'package:worfrontend/errors/app_error.dart';

class SocketError extends AppError {
  final dynamic payload;

  const SocketError(this.payload);

  @override
  String screenMessage() {
    return "Socket error: ${jsonEncode(payload)}";
  }
}
