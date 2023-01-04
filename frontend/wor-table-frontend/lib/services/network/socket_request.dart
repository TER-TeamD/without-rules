import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart';

class SocketRequest {
  static Future<TResponse> send<TResponse>(
      {required Socket socket,
      required String requestEvent,
      required String responseEvent,
      required TResponse Function(dynamic data) responseBuilder,
      dynamic data}) {
    var completer = Completer<TResponse>();
    socket.once(responseEvent, ((data) {
      var response = responseBuilder(data);
      completer.complete(response);
    }));
    socket.emit(requestEvent, data ?? {});
    return completer.future;
  }
}
