import 'package:Quantifuel/tabs/transactionTracking.dart';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

import 'utils/colors.dart';
import 'tabs/home.dart';
import 'tabs/scanQRCode.dart';
import 'tabs/wallet.dart';
import 'tabs/transactions.dart';
import 'tabs/profile.dart';
import 'tabs/transactionInit.dart';

import 'utils/client.dart';

import 'widgets/fuelAmountInputField.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final cameras = await availableCameras();
  final firstCamera = cameras.first;

  runApp(QuantifuelApp(camera: firstCamera));
}

class QuantifuelApp extends StatefulWidget {
  final CameraDescription camera;

  QuantifuelApp({required this.camera});

  @override
  _QuantifuelAppState createState() => _QuantifuelAppState(camera: camera);
}

class _QuantifuelAppState extends State<QuantifuelApp> {
  final CameraDescription camera;

  _QuantifuelAppState({required this.camera});

  String? _scanResult = "REAR VIEW CAMERA";

  void updateResult(String result) {
    setState(() {
      _scanResult = result;
    });
  }

  String? getResult() {
    return _scanResult;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quantifuel',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: HomePage(
          camera: camera, updateResult: updateResult, getResult: getResult),
    );
  }
}

class HomePage extends StatefulWidget {
  final CameraDescription camera;
  final Function(String) updateResult;
  final Function getResult;

  HomePage(
      {required this.camera,
      required this.updateResult,
      required this.getResult});

  @override
  _HomePageState createState() => _HomePageState(
      camera: camera, updateResult: updateResult, getResult: getResult);
}

class _HomePageState extends State<HomePage> with WidgetsBindingObserver {
  final CameraDescription camera;
  final Function(String) updateResult;
  final Function getResult;

  _HomePageState(
      {required this.camera,
      required this.updateResult,
      required this.getResult});

  Future<bool>? _connectivityFuture;

  int _selectedIndex = 0;
  late Key _qrScannerKey;
  late List<Widget> _widgetOptions;

  var _pin = '';
  var _ufsin = '';
  var _status = '';
  var _uuin = '';
  var _operator = '';
  var _fuelType = '';
  var _qrCodePath = '';

  var _fuelQuantityRequestedInLitre = 0.0;
  var _pricePerLitre = 0.0;
  var _utin = "48629922-15b7e9-6f8c-54d8621e";
  var _FuelType = "Petrol";

  bool _isKeyboardVisible = false;

  void InitTransactionPageSelect(
      pin, ufsin, status, uuin, operator, fuelType, qrCodePath) {
    _pin = pin;
    _ufsin = ufsin;
    _status = status;
    _uuin = uuin;
    _operator = operator;
    _fuelType = fuelType;
    _qrCodePath = qrCodePath;
    _widgetOptions[5] = TransactionInit(
        pin: _pin,
        ufsin: _ufsin,
        status: _status,
        uuin: _uuin,
        operator: _operator,
        fuelType: _fuelType,
        qrCodePath: _qrCodePath,
        ProcessTransactionPageSelect: ProcessTransactionPageSelect);
    setState(() {
      _selectedIndex = 5;
    });
  }

  void ProcessTransactionPageSelect(
      utin, fuelQuantityRequestedInLitre, pricePerLitre, fuelType) {
    _utin = utin;
    _fuelQuantityRequestedInLitre = fuelQuantityRequestedInLitre;
    _pricePerLitre = pricePerLitre;
    _FuelType = fuelType;

    _widgetOptions[6] = TransactionTracking(
      FuelQuantityRequestedInLitres: _fuelQuantityRequestedInLitre,
      PricePerLitre: _pricePerLitre,
      UTIN: _utin,
      FuelType: _FuelType,
    );
    setState(() {
      _selectedIndex = 6;
    });
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _connectivityFuture = Client().TestConnectivity();
    _qrScannerKey = UniqueKey();
    _widgetOptions = <Widget>[
      QRScannerScreen(
          camera: camera,
          updateResult: updateResult,
          getResult: getResult,
          initTransactionPageSelect: InitTransactionPageSelect,
          key: _qrScannerKey),
      Home(),
      Transactions(),
      Wallet(),
      Profile(),
      TransactionInit(
          pin: _pin,
          ufsin: _ufsin,
          status: _status,
          uuin: _uuin,
          operator: _operator,
          fuelType: _fuelType,
          qrCodePath: _qrCodePath,
          ProcessTransactionPageSelect: ProcessTransactionPageSelect),
      TransactionTracking(
        FuelQuantityRequestedInLitres: _fuelQuantityRequestedInLitre,
        PricePerLitre: _pricePerLitre,
        UTIN: _utin,
        FuelType: _FuelType,
      ),
      // Add more widgets here if needed for other tabs
    ];
  }

  @override
  void didChangeMetrics() {
    super.didChangeMetrics();
    // Check if the keyboard is visible or not
    final isKeyboardVisible =
        WidgetsBinding.instance.window.viewInsets.bottom > 0.0;
    if (isKeyboardVisible != _isKeyboardVisible) {
      setState(() {
        _isKeyboardVisible = isKeyboardVisible;
      });
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this); // Remove the observer
    super.dispose();
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    updateResult('REAR VIEW CAMERA');
  }

  void _onFabTapped() {
    setState(() {
      _qrScannerKey = UniqueKey();
      _widgetOptions[0] = QRScannerScreen(
          camera: camera,
          updateResult: updateResult,
          getResult: getResult,
          initTransactionPageSelect: InitTransactionPageSelect,
          key: _qrScannerKey);
      _selectedIndex =
          0; // Set the index for the QRScannerScreen or other widget
    });
    updateResult('REAR VIEW CAMERA');
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
        future: _connectivityFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            // Show loading indicator while the connectivity test is in progress
            return Scaffold(
              body: Center(
                child: CircularProgressIndicator(),
              ),
            );
          } else if (snapshot.hasError || snapshot.data == false) {
            // Show error screen if the connectivity test fails
            return Scaffold(
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.error, size: 64, color: Colors.red),
                    SizedBox(height: 16),
                    Text(
                      'Server Connection Failed',
                      style:
                          TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        // Retry connection
                        setState(() {
                          _connectivityFuture = Client().TestConnectivity();
                        });
                      },
                      child: Text('Retry'),
                    ),
                  ],
                ),
              ),
            );
          } else {
            return Scaffold(
              appBar: AppBar(
                title: Text('Quantifuel',
                    style: TextStyle(fontFamily: 'SansationBold')),
                foregroundColor: Colors.white,
                actions: [
                  IconButton(
                    icon: Icon(Icons.menu),
                    onPressed: () {
                      // Handle menu button press
                    },
                  ),
                ],
                flexibleSpace: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: <Color>[
                        AppColors.appBarTopRed,
                        AppColors.appBarBottomRed
                      ],
                    ),
                  ),
                ),
              ),
              body: _widgetOptions[_selectedIndex],
              bottomNavigationBar: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      AppColors.footerBarTopRed,
                      AppColors.footerBarBottomRed,
                    ],
                  ),
                ),
                child: BottomAppBar(
                  color: Colors
                      .transparent, // Make the BottomAppBar's color transparent
                  shape: CircularNotchedRectangle(),
                  notchMargin: 6.0,
                  clipBehavior: Clip.antiAlias, // Smooth edges for the notch
                  height: 75,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      IconButton(
                        icon: Container(
                          padding: EdgeInsets.all(6.5),
                          decoration: BoxDecoration(
                              color: _selectedIndex == 1
                                  ? Color.fromRGBO(127, 7, 7, 0.725)
                                  : Colors.transparent,
                              shape: BoxShape.circle),
                          child: Image.asset(
                            'assets/icons/home.png',
                            color: _selectedIndex == 1
                                ? Color.fromRGBO(255, 255, 255, 1)
                                : Color.fromRGBO(255, 255, 255, 0.75),
                            width: 30,
                          ),
                        ),
                        onPressed: () {
                          _onItemTapped(1); // Handle home button press
                        },
                      ),
                      IconButton(
                        icon: Container(
                          padding: EdgeInsets.all(6.5),
                          decoration: BoxDecoration(
                              color: _selectedIndex == 2
                                  ? Color.fromRGBO(127, 7, 7, 0.725)
                                  : Colors.transparent,
                              shape: BoxShape.circle),
                          child: Image.asset(
                            'assets/icons/receipt.png',
                            color: _selectedIndex == 2
                                ? Color.fromRGBO(255, 255, 255, 1)
                                : Color.fromRGBO(255, 255, 255, 0.75),
                            width: 30,
                          ),
                        ),
                        onPressed: () {
                          _onItemTapped(2); // Handle home button press
                        },
                      ),
                      SizedBox(width: 50), // The dummy child for spacing
                      IconButton(
                        icon: Container(
                          padding: EdgeInsets.all(6.5),
                          decoration: BoxDecoration(
                              color: _selectedIndex == 3
                                  ? Color.fromRGBO(127, 7, 7, 0.725)
                                  : Colors.transparent,
                              shape: BoxShape.circle),
                          child: Image.asset(
                            'assets/icons/wallet.png',
                            color: _selectedIndex == 3
                                ? Color.fromRGBO(255, 255, 255, 1)
                                : Color.fromRGBO(255, 255, 255, 0.75),
                            width: 30,
                          ),
                        ),
                        onPressed: () {
                          _onItemTapped(3); // Handle home button press
                        },
                      ),
                      IconButton(
                        icon: Container(
                          padding: EdgeInsets.all(6.5),
                          decoration: BoxDecoration(
                              color: _selectedIndex == 4
                                  ? Color.fromRGBO(127, 7, 7, 0.725)
                                  : Colors.transparent,
                              shape: BoxShape.circle),
                          child: Image.asset(
                            'assets/icons/profile.png',
                            color: _selectedIndex == 4
                                ? Color.fromRGBO(255, 255, 255, 1)
                                : Color.fromRGBO(255, 255, 255, 0.75),
                            width: 30,
                          ),
                        ),
                        onPressed: () {
                          _onItemTapped(4); // Handle home button press
                        },
                      ),
                    ],
                  ),
                ),
              ),
              floatingActionButtonLocation:
                  FloatingActionButtonLocation.centerDocked,
              floatingActionButton: _isKeyboardVisible
                  ? null
                  : Stack(
                      alignment: Alignment.center,
                      children: [
                        Container(
                          width: 70,
                          height: 70,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: RadialGradient(
                              center: Alignment.center,
                              radius: 0.7,
                              colors: [
                                AppColors.scannerBtnCenterRed,
                                AppColors.scannerBtnOuterRed,
                              ],
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black45,
                                offset: Offset(0, 3),
                                blurRadius: 8.0,
                              ),
                            ],
                          ),
                        ),
                        FloatingActionButton(
                          onPressed: _onFabTapped,
                          child: Transform.scale(
                            scale: 0.95,
                            child: Image.asset(
                                'assets/icons/qr_code_scanner.png',
                                color: Colors.white),
                          ),
                          backgroundColor: Colors.transparent,
                          // elevation: 0,
                        ),
                      ],
                    ),
            );
          }
        });
  }
}
