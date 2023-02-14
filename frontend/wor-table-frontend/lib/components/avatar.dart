import 'package:flutter/widgets.dart';
import '../constants.dart';

class Avatar extends StatelessWidget {
  final String avatar;

  const Avatar({ Key? key, required this.avatar }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      PROD ? 'assets/images/avatars/$avatar.png' : 'images/avatars/$avatar.png',
      width: 30.0,
    );
  }
}
