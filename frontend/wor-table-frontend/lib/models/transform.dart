import 'dart:ui';

import 'package:flutter/widgets.dart';

class AppTransform {
  final Offset position;
  final double rotation;

  const AppTransform(this.position, this.rotation);

  AppTransform operator +(AppTransform other) {
    return AppTransform(position + other.position, rotation + other.rotation);
  }

  AppTransform operator -(AppTransform other) {
    return AppTransform(position - other.position, rotation - other.rotation);
  }

  AppTransform operator *(double other) {
    return AppTransform(position * other, rotation * other);
  }
}