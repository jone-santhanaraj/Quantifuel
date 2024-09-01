import 'package:flutter/material.dart';

class BlinkingText extends StatefulWidget {
  final String text;
  final String? fontFamily;
  final FontWeight? fontWeight;
  final Color? color;
  final double? fontSize;
  final int? blinkDuration;

  const BlinkingText({
    required this.text,
    this.fontFamily,
    this.color,
    this.fontSize,
    this.fontWeight,
    this.blinkDuration,
    Key? key,
  }) : super(key: key);

  @override
  _BlinkingTextState createState() => _BlinkingTextState(
        text: text,
        fontFamily: fontFamily,
        color: color,
        fontSize: fontSize,
        fontWeight: fontWeight,
        blinkDuration: blinkDuration,
      );
}

class _BlinkingTextState extends State<BlinkingText>
    with SingleTickerProviderStateMixin {
  final String text;
  final String? fontFamily;
  final FontWeight fontWeight;
  final Color color;
  final double fontSize;
  final int blinkDuration;

  _BlinkingTextState({
    required this.text,
    String? fontFamily,
    Color? color,
    double? fontSize,
    FontWeight? fontWeight,
    int? blinkDuration,
  })  : this.fontFamily = fontFamily ??
            'SansationLight', // Assign your default font family here
        this.fontWeight = fontWeight ?? FontWeight.normal,
        this.color = color ?? Colors.black,
        this.fontSize = fontSize ?? 20.0,
        this.blinkDuration = blinkDuration ?? 1;

  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();

    // Initialize the AnimationController
    _controller = AnimationController(
      duration:
          Duration(seconds: blinkDuration), // Duration of one blinking cycle
      vsync: this,
    )..repeat(reverse: true); // Repeat the animation in reverse (blink)

    // Define the animation curve
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut, // Smooth transition
    );
  }

  @override
  void dispose() {
    _controller.dispose(); // Dispose the controller when done
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final screenWidth = constraints.maxWidth;
        final screenHeight = constraints.maxHeight;

        // Responsive base width for scaling
        final double baseWidth = 400.0;
        final double scaleFactor = screenWidth / baseWidth;

        return AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            return Opacity(
              opacity: _animation.value, // Use animation value for opacity
              child: Padding(
                padding: EdgeInsets.symmetric(
                  vertical: 0, // Scale padding based on screen size
                ),
                child: Text(
                  text,
                  style: TextStyle(
                    fontFamily: fontFamily,
                    fontSize: fontSize * scaleFactor, // Scale font size
                    fontWeight: fontWeight,
                    color: color,
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
