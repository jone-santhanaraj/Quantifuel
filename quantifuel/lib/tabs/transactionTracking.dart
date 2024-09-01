// import 'dart:async';
// import 'package:flutter/material.dart';
// import 'dart:convert';

// import 'package:syncfusion_flutter_gauges/gauges.dart';

// import '../utils/colors.dart';

// import '../widgets/blinkingText.dart';

// class TransactionTracking extends StatefulWidget {
//   final double FuelQuantityRequestedInLitres;
//   final double PricePerLitre;

//   const TransactionTracking(
//       {required this.FuelQuantityRequestedInLitres,
//       required this.PricePerLitre,
//       super.key});

//   @override
//   State<TransactionTracking> createState() => _TransactionTrackingState(
//       FuelQunantityRequestedInLitre: FuelQuantityRequestedInLitres,
//       PricePerLitre: PricePerLitre);
// }

// class _TransactionTrackingState extends State<TransactionTracking> {
//   final double FuelQunantityRequestedInLitre;
//   final double PricePerLitre;

//   _TransactionTrackingState(
//       {required this.FuelQunantityRequestedInLitre,
//       required this.PricePerLitre});

//   @override
//   Widget build(BuildContext context) {
//     double getAppropriateInterval(maxValue) {
//       return ((maxValue - 0.1) ~/ 2) * 0.1 + 0.1;
//     }

//     return LayoutBuilder(builder: (context, constraints) {
//       final screenWidth = constraints.maxWidth;
//       final screenHeight = constraints.maxHeight;

//       // Responsive values for padding, font sizes, etc.
//       final double baseWidth = 400.0;
//       final double scaleFactor = screenWidth / baseWidth;

//       var pricePerLitre = 110.4;

//       var requestedAmount = 10.0;

//       var pointerPosition = requestedAmount / 1.34;

//       final double calculatedPrice;
//       calculatedPrice = requestedAmount * pricePerLitre;

//       var priceIntervalCount = getAppropriateInterval(calculatedPrice);
//       var fuelIntervalCount = getAppropriateInterval(requestedAmount);

//       // final double pricePerLitre;

//       return Container(
//         child: Column(
//           children: <Widget>[
//             Container(
//               height: screenHeight * 0.07,
//               color: AppColors.footerBarBottomRed,
//               child: Center(
//                 child: Text(
//                   'Transaction Tracking',
//                   style: TextStyle(
//                     color: Colors.white,
//                     fontSize: 20 * scaleFactor,
//                   ),
//                 ),
//               ),
//             ),
//             Expanded(
//                 // child: Container(
//                 //   child: Center(
//                 //     child: Text(
//                 //       'Transaction Tracking',
//                 //       style: TextStyle(
//                 //           color: AppColors.appBarTopRed,
//                 //           fontSize: 15 * scaleFactor),
//                 //     ),
//                 //   ),
//                 // ),
//                 child: Column(
//               children: [
//                 SfRadialGauge(
//                   enableLoadingAnimation: true,
//                   animationDuration: 3000,
//                   axes: <RadialAxis>[
//                     RadialAxis(
//                         minimum: 0,
//                         maximum: calculatedPrice,
//                         interval: priceIntervalCount,
//                         ticksPosition: ElementsPosition.outside,
//                         labelsPosition: ElementsPosition.outside,
//                         minorTicksPerInterval: 5,
//                         radiusFactor: 1 * scaleFactor,
//                         labelOffset: 12 * scaleFactor,
//                         minorTickStyle: MinorTickStyle(
//                             thickness: 1.5 * scaleFactor,
//                             color: Color.fromARGB(255, 143, 20, 2),
//                             length: 0.05 * scaleFactor,
//                             lengthUnit: GaugeSizeUnit.factor),
//                         majorTickStyle: MinorTickStyle(
//                           thickness: 1.5 * scaleFactor,
//                           color: Color.fromARGB(255, 143, 20, 2),
//                           length: 0.10 * scaleFactor,
//                           lengthUnit: GaugeSizeUnit.factor,
//                         ),
//                         axisLineStyle: AxisLineStyle(
//                           thickness: 3 * scaleFactor,
//                           color: Color.fromARGB(255, 143, 20, 2),
//                         ),
//                         axisLabelStyle: GaugeTextStyle(
//                           fontSize: 8 * scaleFactor,
//                           fontFamily: 'SansationBold',
//                           color: Color.fromARGB(255, 143, 20, 2),
//                         ),
//                         ranges: <GaugeRange>[
//                           GaugeRange(
//                             startValue: 0,
//                             endValue: calculatedPrice,
//                             gradient: const SweepGradient(colors: <Color>[
//                               Color.fromRGBO(200, 0, 0, 1),
//                               Color.fromRGBO(0, 180, 0, 1)
//                             ], stops: <double>[
//                               0.25,
//                               0.75
//                             ]),
//                           )
//                         ]),
//                     // RadialAxis(
//                     //     radiusFactor: 0.75 * scaleFactor,
//                     //     ranges: <GaugeRange>[
//                     //       GaugeRange(startValue: 30, endValue: 65)
//                     //     ]),
//                     RadialAxis(
//                         minimum: 0,
//                         maximum: requestedAmount,
//                         interval: fuelIntervalCount,
//                         radiusFactor: 0.7 * scaleFactor,
//                         labelOffset: 10 * scaleFactor,
//                         minorTicksPerInterval: 5,
//                         minorTickStyle: MinorTickStyle(
//                             color: Colors.black,
//                             thickness: 1.5 * scaleFactor,
//                             lengthUnit: GaugeSizeUnit.factor,
//                             length: 0.05 * scaleFactor),
//                         majorTickStyle: MajorTickStyle(
//                             color: Colors.black,
//                             thickness: 1.5 * scaleFactor,
//                             lengthUnit: GaugeSizeUnit.factor,
//                             length: 0.10 * scaleFactor),
//                         axisLineStyle: AxisLineStyle(
//                           color: Colors.black,
//                           thickness: 3 * scaleFactor,
//                         ),
//                         axisLabelStyle: GaugeTextStyle(
//                             color: Colors.black,
//                             fontSize: 10 * scaleFactor,
//                             fontFamily: 'SansationLight'),
//                         pointers: <GaugePointer>[
//                           NeedlePointer(
//                             value: pointerPosition,
//                             needleLength: 0.7 * scaleFactor,
//                             lengthUnit: GaugeSizeUnit.factor,
//                             needleColor: AppColors.appBarBottomRed,
//                             needleStartWidth: 1,
//                             needleEndWidth: 5,
//                             knobStyle: KnobStyle(
//                               knobRadius: 0.08,
//                               sizeUnit: GaugeSizeUnit.factor,
//                               borderColor: Color.fromARGB(255, 143, 20, 2),
//                               color: Colors.white,
//                               borderWidth: 0.05,
//                             ),
//                           ),
//                         ]),
//                   ],
//                 ),
//                 Transform.translate(
//                   offset: Offset(
//                       0,
//                       -100 *
//                           scaleFactor), // Move the widget 10 units down along the y-axis
//                   child: Text(
//                     '0000.00',
//                     style: TextStyle(
//                       fontFamily: 'SevenSegment',
//                       fontSize: 25 * scaleFactor,
//                       color: const Color.fromARGB(255, 0, 0, 0),
//                     ),
//                   ),
//                 ),
//                 Transform.translate(
//                   offset: Offset(
//                       0,
//                       -110 *
//                           scaleFactor), // Move the widget 10 units down along the y-axis
//                   child: Text(
//                     '0000.00',
//                     style: TextStyle(
//                       fontFamily: 'SevenSegment',
//                       fontSize: 25 * scaleFactor,
//                       color: const Color.fromARGB(200, 100, 100, 100),
//                     ),
//                   ),
//                 ),
//                 Text('Current Status',
//                     style: TextStyle(
//                         fontSize: 12 * scaleFactor,
//                         fontFamily: 'SansationLight',
//                         color: Color.fromRGBO(0, 0, 0, 0.5))),
//                 BlinkingText(
//                   text: 'Fuelling..',
//                   fontFamily: 'SansationBold',
//                   color: Color.fromRGBO(0, 180, 0, 1),
//                 )
//               ],
//             )),
//           ],
//         ),
//       );
//     });
//   }
// }
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

import '../utils/colors.dart';
import '../widgets/blinkingText.dart';
import '../widgets/fillingGauge.dart';

class TransactionTracking extends StatefulWidget {
  final double FuelQuantityRequestedInLitres;
  final double PricePerLitre;
  final String UTIN;
  final String FuelType;

  const TransactionTracking({
    required this.FuelQuantityRequestedInLitres,
    required this.PricePerLitre,
    required this.UTIN,
    required this.FuelType,
    super.key,
  });

  @override
  State<TransactionTracking> createState() => _TransactionTrackingState(
        FuelQunantityRequestedInLitre: FuelQuantityRequestedInLitres,
        PricePerLitre: PricePerLitre,
        UTIN: UTIN,
        FuelType: FuelType,
      );
}

class _TransactionTrackingState extends State<TransactionTracking> {
  final double FuelQunantityRequestedInLitre;
  final double PricePerLitre;
  final String UTIN;
  final String FuelType;

  double _pointerPosition = 0.0;

  @override
  _TransactionTrackingState({
    required this.FuelQunantityRequestedInLitre,
    required this.PricePerLitre,
    required this.UTIN,
    required this.FuelType,
  });

  void initState() {
    super.initState();
    _pointerPosition = FuelQunantityRequestedInLitre / 1.34;
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double getAppropriateInterval(maxValue) {
      return ((maxValue - 0.1) ~/ 2) * 0.1 + 0.1;
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        final screenWidth = constraints.maxWidth;
        final screenHeight = constraints.maxHeight;

        // Responsive values for padding, font sizes, etc.
        final double baseWidth = 400.0;
        final double scaleFactor = screenWidth / baseWidth;

        var pricePerLitre = PricePerLitre;
        var requestedAmount = FuelQunantityRequestedInLitre;
        var fuelType = FuelType;

        final double calculatedPrice = requestedAmount * pricePerLitre;
        var priceIntervalCount = getAppropriateInterval(calculatedPrice);
        var fuelIntervalCount = getAppropriateInterval(requestedAmount);

        return Container(
          child: Column(
            children: <Widget>[
              Container(
                height: screenHeight * 0.07,
                color: AppColors.footerBarBottomRed,
                child: Center(
                  child: Text(
                    'Transaction Tracking',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20 * scaleFactor,
                      fontFamily: 'SansationBold',
                    ),
                  ),
                ),
              ),
              Expanded(
                child: Column(
                  children: [
                    Text(UTIN,
                        style: TextStyle(
                            fontSize: 14,
                            color: Color.fromRGBO(0, 0, 0, 0.5),
                            fontFamily: 'Sansation')),
                    SizedBox(
                      height: 50 * scaleFactor,
                    ),
                    FillingGauge(
                      pointerPosition: _pointerPosition,
                      requestedAmount: requestedAmount,
                      calculatedPrice: calculatedPrice,
                      priceIntervalCount: priceIntervalCount,
                      fuelIntervalCount: fuelIntervalCount,
                      scaleFactor: scaleFactor,
                      filledFuel: '0000.00',
                      filledPrice: '0000.00',
                    ),
                    Transform.translate(
                        offset: Offset(
                          0,
                          -80 * scaleFactor,
                        ),
                        child: Column(children: [
                          Text(FuelType,
                              style: TextStyle(
                                  fontSize: 20 * scaleFactor,
                                  color: Color.fromRGBO(4, 71, 205, 0.8),
                                  fontFamily: 'SansationBold')),
                          SizedBox(height: 20 * scaleFactor),
                          Column(children: [
                            Text(
                              'Current Status',
                              style: TextStyle(
                                fontSize: 12 * scaleFactor,
                                fontFamily: 'SansationLight',
                                color: const Color.fromRGBO(0, 0, 0, 0.5),
                              ),
                            ),
                            BlinkingText(
                              text: 'Fuelling..',
                              fontFamily: 'SansationBold',
                              color: Color.fromRGBO(0, 180, 0, 1),
                              blinkDuration: 2,
                            )
                          ]),
                          SizedBox(
                            height: 20 * scaleFactor,
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              Column(children: [
                                Text('Fuel Quantity: ',
                                    style: TextStyle(
                                        fontSize: 12 * scaleFactor,
                                        fontFamily: 'Sansation')),
                                Text(requestedAmount.toString(),
                                    style: TextStyle(
                                        fontSize: 20 * scaleFactor,
                                        fontFamily: 'SansationBold')),
                              ]),
                              Column(
                                children: [
                                  Text('Price Per Litre: ',
                                      style: TextStyle(
                                          fontSize: 12 * scaleFactor,
                                          fontFamily: 'Sansation')),
                                  Text(pricePerLitre.toString(),
                                      style: TextStyle(
                                          fontSize: 20 * scaleFactor,
                                          fontFamily: 'SansationBold')),
                                ],
                              )
                            ],
                          )
                        ])),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
