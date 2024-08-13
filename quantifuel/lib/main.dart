import 'package:camera/camera.dart';
import 'package:flutter/material.dart';

import 'utils/colors.dart';
import 'tabs/home.dart';
import 'tabs/scanQRCode.dart';
import 'tabs/wallet.dart';
import 'tabs/transactions.dart';
import 'tabs/profile.dart';

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

class _HomePageState extends State<HomePage> {
  final CameraDescription camera;
  final Function(String) updateResult;
  final Function getResult;

  _HomePageState(
      {required this.camera,
      required this.updateResult,
      required this.getResult});

  int _selectedIndex = 0;
  late Key _qrScannerKey;
  late List<Widget> _widgetOptions;

  @override
  void initState() {
    super.initState();
    _qrScannerKey = UniqueKey();
    _widgetOptions = <Widget>[
      QRScannerScreen(
          camera: camera,
          updateResult: updateResult,
          getResult: getResult,
          key: _qrScannerKey),
      Home(),
      Transactions(),
      Wallet(),
      Profile(),
      // Add more widgets here if needed for other tabs
    ];
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
          key: _qrScannerKey);
      _selectedIndex =
          0; // Set the index for the QRScannerScreen or other widget
    });
    updateResult('REAR VIEW CAMERA');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title:
              Text('Quantifuel', style: TextStyle(fontFamily: 'SansationBold')),
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
            color:
                Colors.transparent, // Make the BottomAppBar's color transparent
            shape: CircularNotchedRectangle(),
            notchMargin: 5.0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                IconButton(
                  icon: Image.asset(
                    'assets/icons/home.png',
                    color: Color.fromRGBO(255, 255, 255, 0.75),
                    width: 30,
                  ),
                  onPressed: () {
                    _onItemTapped(1); // Handle home button press
                  },
                ),
                IconButton(
                  icon: Image.asset(
                    'assets/icons/receipt.png',
                    color: Color.fromRGBO(255, 255, 255, 0.75),
                    width: 30,
                  ),
                  onPressed: () {
                    _onItemTapped(2); // Handle receipt button press
                  },
                ),
                SizedBox(width: 40), // The dummy child for spacing
                IconButton(
                  icon: Image.asset(
                    'assets/icons/history.png',
                    color: Color.fromRGBO(255, 255, 255, 0.75),
                    width: 30,
                  ),
                  onPressed: () {
                    _onItemTapped(3); // Handle history button press
                  },
                ),
                IconButton(
                  icon: Image.asset(
                    'assets/icons/profile.png',
                    color: Color.fromRGBO(255, 255, 255, 0.75),
                    width: 30,
                  ),
                  onPressed: () {
                    _onItemTapped(4); // Handle profile button press
                  },
                ),
              ],
            ),
          ),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
        floatingActionButton: Stack(
          alignment: Alignment.center,
          children: [
            Container(
              width: 75,
              height: 75,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  center: Alignment.center,
                  radius: 0.75,
                  colors: [
                    AppColors.scannerBtnCenterRed,
                    AppColors.scannerBtnOuterRed,
                  ],
                ),
              ),
            ),
            FloatingActionButton(
              onPressed: _onFabTapped,
              child: Transform.scale(
                scale: 1.12,
                child: Image.asset('assets/icons/qr_code_scanner.png',
                    color: Colors.white),
              ),
              backgroundColor: Colors.transparent,
              // elevation: 0,
            ),
          ],
        ));
  }
}
