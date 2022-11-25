import 'package:rxdart/rxdart.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:worfrontend/errors/network_uninitialized.dart';

import 'network_message.dart';

class NetworkService {
  WebSocketChannel? channel;
  final BehaviorSubject<NetworkMessage> onEvent = BehaviorSubject();

  connect(String hostname) async {
    channel = WebSocketChannel.connect(Uri.parse(hostname));
    channel!.stream.listen((event) {
      onEvent.add(NetworkMessage.create(event));
    });
  }

  send(dynamic value) {
    if (channel == null) throw NetworkUninitialized();
    channel!.sink.add(value);
  }
}
