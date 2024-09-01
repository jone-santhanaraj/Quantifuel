import 'dart:async';
import 'package:flutter/material.dart';
import 'dart:convert';

import '../utils/client.dart';
import 'package:Quantifuel/utils/colors.dart';

import '../widgets/fuelAmountInputField.dart';

class TransactionInit extends StatefulWidget {
  final String pin;
  final String ufsin;
  final String status;
  final String uuin;
  final String operator;
  final String fuelType;
  final String qrCodePath;
  final Function ProcessTransactionPageSelect;

  TransactionInit(
      {required this.pin,
      required this.ufsin,
      required this.status,
      required this.uuin,
      required this.operator,
      required this.fuelType,
      required this.qrCodePath,
      required this.ProcessTransactionPageSelect});

  @override
  _TransactionInitState createState() => _TransactionInitState(
      pin: pin,
      ufsin: ufsin,
      status: status,
      uuin: uuin,
      operator: operator,
      fuelType: fuelType,
      qrCodePath: qrCodePath,
      ProcessTransactionPageSelect: ProcessTransactionPageSelect);
}

class _TransactionInitState extends State<TransactionInit>
    with WidgetsBindingObserver {
  final String pin;
  final String ufsin;
  final String status;
  final String uuin;
  final String operator;
  final String fuelType;
  final String qrCodePath;
  final Function ProcessTransactionPageSelect;

  _TransactionInitState(
      {required this.pin,
      required this.ufsin,
      required this.status,
      required this.uuin,
      required this.operator,
      required this.fuelType,
      required this.qrCodePath,
      required this.ProcessTransactionPageSelect});

  bool _isKeyboardVisible = false;
  Timer? _inactiveTimer;

  String? _typedValue;

  void _onChanged(String value) {
    setState(() {
      _typedValue = value;
    });
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _startInactivityTimer();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _inactiveTimer?.cancel();
    super.dispose();
  }

  @override
  void didChangeMetrics() {
    final bottomInset = WidgetsBinding.instance.window.viewInsets.bottom;
    setState(() {
      _isKeyboardVisible = bottomInset > 0;
    });
  }

  Future<String> GetStationName(ufsin) async {
    var stationNameRes = await Client().GetFuelStationName(ufsin);
    String stationName = jsonDecode(stationNameRes)['name'];
    return stationName;
  }

  int hardLimitOnMaxPay = 200000;

  String _selectedInputType = 'L'; // Default selection

  void _onInputTypeChanged(String newInputType) {
    setState(() {
      _selectedInputType = newInputType;
    }); // You can use this value as needed
  }

  void InitTrans(pin, ufsin, uuin) async {
    FocusScope.of(context).unfocus();
    print(
        "Init Trans Pressed \nEntered Value: $_typedValue \nPIN: $pin \nUFSIN: $ufsin \nUUIN: $uuin");

    var res = await Client().GetPricePerLitre(fuelType);
    var fuel = jsonDecode(res);
    // print('${fuel} \n ${double.parse(fuel.pricePerLitre.toString())}');
    print(fuel['pricePerLitre']);

    var pricePerLitre;
    if (fuel != null && fuel['pricePerLitre'] != null) {
      pricePerLitre = double.parse(fuel['pricePerLitre'].toString());
      pricePerLitre = double.parse(pricePerLitre.toStringAsFixed(2));
    } else {
      print('Failed to get price per litre data - client');
      debugPrint('Failed to get price per litre data - client');
    }
    var fuelQuantityInLitre;

    if (_selectedInputType == 'L') {
      fuelQuantityInLitre = double.parse(_typedValue.toString());
      fuelQuantityInLitre = double.parse(fuelQuantityInLitre
          .toStringAsFixed(2)); // Get the fuel quantity in litres
    } else if (_selectedInputType == '₹') {
      fuelQuantityInLitre = double.parse(
          (double.parse(_typedValue!) / pricePerLitre)
              .toStringAsFixed(2)); // Calculate the fuel quantity in litres
    } else {
      fuelQuantityInLitre = hardLimitOnMaxPay % pricePerLitre;
    }
    var response = await Client().InitTransaction(
        uuin, '$ufsin-$pin', fuelQuantityInLitre, pricePerLitre, fuelType);
    if (response != null) {
      var UTIN = response['utin'];
      var FuelType = response['fuelType'];

      ProcessTransactionPageSelect(
          UTIN, fuelQuantityInLitre, pricePerLitre, FuelType);
    } else {
      print('Failed to post transaction data - client');
      debugPrint('Failed to post transaction data - client');
    }
  }

  void _startInactivityTimer() {
    _inactiveTimer?.cancel();
    _inactiveTimer = Timer(Duration(seconds: 30), () {
      FocusScope.of(context).unfocus(); // Unfocus the TextField
    });
  }

  void _resetInactivityTimer() {
    _startInactivityTimer();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Screen width and height
        final screenWidth = constraints.maxWidth;
        final screenHeight = constraints.maxHeight;

        // Responsive values for padding, font sizes, etc.
        final double baseWidth = 400.0;
        final double scaleFactor = screenWidth / baseWidth;

        return GestureDetector(
          onTap: () {
            FocusScope.of(context)
                .unfocus(); // Unfocus the TextField when tapping outside
          },
          child: Scaffold(
            body: Align(
              alignment: Alignment.center,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  if (!_isKeyboardVisible)
                    SizedBox(
                      height: screenHeight * 0.1,
                      width: screenWidth * 0.2,
                      child: Image.network(
                        qrCodePath,
                        loadingBuilder: (BuildContext context, Widget child,
                            ImageChunkEvent? loadingProgress) {
                          if (loadingProgress == null) {
                            return child;
                          } else {
                            return Center(
                              child: CircularProgressIndicator(
                                value: loadingProgress.expectedTotalBytes !=
                                        null
                                    ? loadingProgress.cumulativeBytesLoaded /
                                        (loadingProgress.expectedTotalBytes ??
                                            1)
                                    : null,
                              ),
                            );
                          }
                        },
                        errorBuilder: (BuildContext context, Object exception,
                            StackTrace? stackTrace) {
                          return Text('Failed to load image!');
                        },
                      ),
                    ),
                  SizedBox(height: screenHeight * 0.02),
                  Text('Fuel Station Name:',
                      style: TextStyle(
                          fontSize: 12 * scaleFactor,
                          fontFamily: 'SansationLight',
                          color: Color.fromRGBO(0, 0, 0, 0.5))),
                  FutureBuilder<String>(
                    future: GetStationName(ufsin),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return CircularProgressIndicator(); // Display a loading indicator while waiting
                      } else if (snapshot.hasError) {
                        return Text('Error: ${snapshot.error}');
                      } else if (snapshot.hasData) {
                        return Text(snapshot.data!,
                            style: TextStyle(
                                fontSize: 20 * scaleFactor,
                                fontFamily: 'SansationBold'));
                      } else {
                        return Text('No Station Name Available!');
                      }
                    },
                  ),
                  Text(ufsin,
                      style: TextStyle(
                          fontSize: 10 * scaleFactor,
                          fontFamily: 'SansationBoldItalic',
                          fontWeight: FontWeight.bold)),
                  SizedBox(height: screenHeight * 0.02),
                  Text('Fuel Type:',
                      style: TextStyle(
                          fontSize: 12 * scaleFactor,
                          fontFamily: 'SansationLight',
                          color: Color.fromRGBO(0, 0, 0, 0.5))),
                  Text('$fuelType',
                      style: TextStyle(
                          fontSize: 20 * scaleFactor,
                          fontFamily: 'SansationBold')),
                  Text(pin,
                      style: TextStyle(
                          fontSize: 10 * scaleFactor,
                          fontFamily: 'SansationBoldItalic',
                          fontWeight: FontWeight.bold)),
                  SizedBox(height: screenHeight * 0.02),
                  Text('Operator:',
                      style: TextStyle(
                          fontSize: 12 * scaleFactor,
                          fontFamily: 'SansationLight',
                          color: Color.fromRGBO(0, 0, 0, 0.5))),
                  Text('$operator',
                      style: TextStyle(
                          fontSize: 20 * scaleFactor,
                          fontFamily: 'SansationBold')),
                  Text(uuin,
                      style: TextStyle(
                          fontSize: 10 * scaleFactor,
                          fontFamily: 'SansationBoldItalic',
                          fontWeight: FontWeight.bold)),
                  SizedBox(height: screenHeight * 0.02),
                  Text('Status:',
                      style: TextStyle(
                          fontSize: 12 * scaleFactor,
                          fontFamily: 'SansationLight',
                          color: Color.fromRGBO(0, 0, 0, 0.5))),
                  Text('$status',
                      style: TextStyle(
                          fontSize: 20 * scaleFactor,
                          fontFamily: 'SansationBold',
                          fontWeight: FontWeight.bold,
                          color: Color.fromRGBO(0, 180, 0, 1))),
                  SizedBox(height: screenHeight * 0.02),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        'Enter Fuel Amount:',
                        style: TextStyle(
                            fontSize: 12 * scaleFactor,
                            fontFamily: 'SansationLight',
                            color: Color.fromRGBO(
                                0, 0, 0, 0.5) // Adjust the font size here
                            ),
                      ),
                      SizedBox(
                          height: screenHeight *
                              0.01), // Space between the text and the text field
                      Container(
                        width: screenWidth *
                            0.9, // Adjust the width of the TextField
                        child: FuelAmountInputField(
                          onChanged: _onChanged,
                          onInputTypeChanged: _onInputTypeChanged,
                        ),
                        // child: TextField(
                        //   cursorColor: AppColors.appBarBottomRed,
                        //   decoration: InputDecoration(
                        //     border: OutlineInputBorder(),
                        //     labelText: 'Enter Fuel Amount in Litres',
                        //     labelStyle: TextStyle(
                        //         fontSize: 14 * scaleFactor,
                        //         fontFamily: 'Sansation',
                        //         color: Color.fromRGBO(0, 0, 0, 0.35)),
                        //     contentPadding: EdgeInsets.symmetric(
                        //         vertical: screenHeight * 0.01,
                        //         horizontal: screenWidth * 0.03),
                        //     focusedBorder: OutlineInputBorder(
                        //       borderSide: BorderSide(
                        //         color: AppColors.appBarTopRed,
                        //         width: 2.0,
                        //       ),
                        //     ),
                        //     enabledBorder: OutlineInputBorder(
                        //       borderSide: BorderSide(
                        //         color: Colors.grey,
                        //         width: 1.0,
                        //       ),
                        //     ),
                        //   ),
                        //   style: TextStyle(
                        //     fontSize: 14 * scaleFactor,
                        //     fontFamily: 'Sansation',
                        //   ),
                        //   onChanged: (text) {
                        //     _resetInactivityTimer(); // Reset the inactivity timer on text input
                        //   },
                        // ),
                      ),
                    ],
                  ),
                  SizedBox(height: screenHeight * 0.02),
                  ElevatedButton(
                    onPressed: () {
                      InitTrans(pin, ufsin, uuin);
                    },
                    child: Text('Confirm and Proceed',
                        style: TextStyle(
                            fontSize: 14 * scaleFactor,
                            fontFamily: 'Sansation',
                            fontWeight: FontWeight.bold,
                            color: AppColors.appBarTopRed)),
                    style: ButtonStyle(
                      padding: MaterialStateProperty.all<EdgeInsets>(
                          EdgeInsets.symmetric(
                              vertical: screenHeight * 0.02,
                              horizontal: screenWidth * 0.1)),
                      backgroundColor: MaterialStateProperty.all<Color>(
                          Color.fromRGBO(230, 230, 230, 1)),
                    ),
                  ),
                  Text(
                    '$ufsin-$pin',
                    style: TextStyle(
                        fontSize: 10 * scaleFactor,
                        fontFamily: 'SansationLightItalic',
                        fontWeight: FontWeight.bold,
                        color: Color.fromRGBO(188, 188, 188, 0.8)),
                  )
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
