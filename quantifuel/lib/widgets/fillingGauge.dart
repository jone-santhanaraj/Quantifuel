import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_gauges/gauges.dart';

import '../utils/colors.dart';

class FillingGauge extends StatefulWidget {
  final double pointerPosition;
  final double requestedAmount;
  final double calculatedPrice;
  final double priceIntervalCount;
  final double fuelIntervalCount;
  final double scaleFactor;
  final String filledFuel;
  final String filledPrice;

  const FillingGauge({
    Key? key,
    required this.pointerPosition,
    required this.requestedAmount,
    required this.calculatedPrice,
    required this.priceIntervalCount,
    required this.fuelIntervalCount,
    required this.scaleFactor,
    required this.filledFuel,
    required this.filledPrice,
  }) : super(key: key);

  @override
  _FillingGaugeState createState() => _FillingGaugeState();
}

class _FillingGaugeState extends State<FillingGauge> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SfRadialGauge(
          enableLoadingAnimation: true,
          animationDuration: 3000,
          axes: <RadialAxis>[
            RadialAxis(
              minimum: 0,
              maximum: widget.calculatedPrice,
              interval: widget.priceIntervalCount,
              ticksPosition: ElementsPosition.outside,
              labelsPosition: ElementsPosition.outside,
              minorTicksPerInterval: 5,
              radiusFactor: 1 * widget.scaleFactor,
              labelOffset: 12 * widget.scaleFactor,
              minorTickStyle: MinorTickStyle(
                thickness: 1.5 * widget.scaleFactor,
                color: const Color.fromARGB(255, 143, 20, 2),
                length: 0.05 * widget.scaleFactor,
                lengthUnit: GaugeSizeUnit.factor,
              ),
              majorTickStyle: MinorTickStyle(
                thickness: 1.5 * widget.scaleFactor,
                color: const Color.fromARGB(255, 143, 20, 2),
                length: 0.10 * widget.scaleFactor,
                lengthUnit: GaugeSizeUnit.factor,
              ),
              axisLineStyle: AxisLineStyle(
                thickness: 3 * widget.scaleFactor,
                color: const Color.fromARGB(255, 143, 20, 2), // Base color
                gradient: SweepGradient(
                  colors: <Color>[
                    Color.fromRGBO(200, 0, 0, 1),
                    Color.fromRGBO(0, 180, 0, 1),
                  ],
                  stops: <double>[0.25, 0.75],
                ),
              ),
              axisLabelStyle: GaugeTextStyle(
                fontSize: 8 * widget.scaleFactor,
                fontFamily: 'SansationBold',
                color: const Color.fromARGB(255, 143, 20, 2),
              ),
              ranges: <GaugeRange>[
                GaugeRange(
                  startValue: 0,
                  endValue: widget.calculatedPrice,
                  gradient: const SweepGradient(
                    colors: <Color>[
                      Color.fromRGBO(200, 0, 0, 1),
                      Color.fromRGBO(0, 180, 0, 1)
                    ],
                    stops: <double>[0.25, 0.75],
                  ),
                )
              ],
            ),
            RadialAxis(
              minimum: 0,
              maximum: widget.requestedAmount,
              interval: widget.fuelIntervalCount,
              radiusFactor: 0.7 * widget.scaleFactor,
              labelOffset: 10 * widget.scaleFactor,
              minorTicksPerInterval: 5,
              minorTickStyle: MinorTickStyle(
                color: Colors.black,
                thickness: 1.5 * widget.scaleFactor,
                lengthUnit: GaugeSizeUnit.factor,
                length: 0.05 * widget.scaleFactor,
              ),
              majorTickStyle: MajorTickStyle(
                color: Colors.black,
                thickness: 1.5 * widget.scaleFactor,
                lengthUnit: GaugeSizeUnit.factor,
                length: 0.10 * widget.scaleFactor,
              ),
              axisLineStyle: AxisLineStyle(
                color: Colors.black,
                thickness: 3 * widget.scaleFactor,
              ),
              axisLabelStyle: GaugeTextStyle(
                color: Colors.black,
                fontSize: 10 * widget.scaleFactor,
                fontFamily: 'SansationLight',
              ),
              pointers: <GaugePointer>[
                NeedlePointer(
                  value: widget.pointerPosition,
                  needleLength: 0.7 * widget.scaleFactor,
                  lengthUnit: GaugeSizeUnit.factor,
                  needleColor: AppColors.appBarBottomRed,
                  needleStartWidth: 1,
                  needleEndWidth: 5,
                  knobStyle: KnobStyle(
                    knobRadius: 0.08,
                    sizeUnit: GaugeSizeUnit.factor,
                    borderColor: const Color.fromARGB(255, 143, 20, 2),
                    color: Colors.white,
                    borderWidth: 0.05,
                  ),
                ),
              ],
            ),
          ],
        ),
        Transform.translate(
          offset: Offset(
            0,
            -100 * widget.scaleFactor,
          ),
          child: RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: '${widget.filledFuel}',
                  style: TextStyle(
                    fontFamily: 'SevenSegment',
                    fontSize: 25 * widget.scaleFactor,
                    color: const Color.fromARGB(255, 0, 0, 0),
                  ),
                ),
                TextSpan(text: ' '),
                TextSpan(
                  text: 'L',
                  style: TextStyle(
                    fontFamily: 'SevenSegment',
                    fontSize: 12 * widget.scaleFactor,
                    color: const Color.fromARGB(255, 0, 0, 0),
                    fontFeatures: [FontFeature.subscripts()],
                  ),
                ),
              ],
            ),
          ),
        ),
        Transform.translate(
          offset: Offset(
            0,
            -100 * widget.scaleFactor,
          ),
          child: RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: '${widget.filledPrice}',
                  style: TextStyle(
                    fontFamily: 'SevenSegment',
                    fontSize: 25 * widget.scaleFactor,
                    color: const Color.fromARGB(200, 100, 100, 100),
                  ),
                ),
                TextSpan(text: ' '),
                TextSpan(
                  text: '₹',
                  style: TextStyle(
                    fontFamily: 'SevenSegment',
                    fontSize: 12 * widget.scaleFactor,
                    color: const Color.fromARGB(200, 100, 100, 100),
                    fontFeatures: [FontFeature.subscripts()],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
