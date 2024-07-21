import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

import 'colors.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final cameras = await availableCameras();
  final firstCamera = cameras.first;

  runApp(QuantifuelApp(camera: firstCamera));
}

class QuantifuelApp extends StatelessWidget {
  final CameraDescription camera;

  QuantifuelApp({required this.camera});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quantifuel',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: QRScannerScreen(camera: camera),
    );
  }
}

class QRScannerScreen extends StatefulWidget {
  final CameraDescription camera;

  QRScannerScreen({required this.camera});

  @override
  _QRScannerScreenState createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  late QRViewController? _qrViewController;
  String? _scanResult = "REAR VIEW CAMERA";

  @override
  void dispose() {
    _qrViewController?.dispose();
    super.dispose();
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      _qrViewController = controller;
    });
    controller.scannedDataStream.listen((scanData) {
      setState(() {
        _scanResult = scanData.code!;
      });
      print('QR Code found: ${scanData.code}');
    });
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
      body: Align(
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(height: 20),
            Text(
              'Scan a Pump QR',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Container(
              height: 300,
              width: 300,
              child: Stack(
                children: [
                  QRView(
                    key: qrKey,
                    onQRViewCreated: _onQRViewCreated,
                    overlay: QrScannerOverlayShape(
                      borderColor: Colors.green,
                      borderRadius: 10,
                      borderLength: 30,
                      borderWidth: 10,
                      cutOutSize: 300,
                    ),
                  ),
                  Center(
                    child: Stack(
                      children: [
                        // Horizontal bar of the cross
                        Positioned(
                          left: 127.5,
                          top: 150,
                          child: Container(
                            width: 50,
                            height: 4,
                            color: Colors.green,
                          ),
                        ),
                        // Vertical bar of the cross
                        Positioned(
                          left: 150,
                          top: 127.5,
                          child: Container(
                            width: 4,
                            height: 50,
                            color: Colors.green,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 10),
            Text(
              'Place the QR Code within the above green box',
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 20),
            Text(
              'Scan Result: $_scanResult',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
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
                icon: Image.asset('assets/icons/home.png', color: Colors.white),
                onPressed: () {
                  // Handle home button press
                },
              ),
              IconButton(
                icon: Image.asset('assets/icons/receipt.png',
                    color: Colors.white),
                onPressed: () {
                  // Handle receipt button press
                },
              ),
              SizedBox(width: 40), // The dummy child for spacing
              IconButton(
                icon: Image.asset('assets/icons/history.png',
                    color: Colors.white),
                onPressed: () {
                  // Handle history button press
                },
              ),
              IconButton(
                icon: Image.asset('assets/icons/profile.png',
                    color: Colors.white),
                onPressed: () {
                  // Handle profile button press
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
            onPressed: () {
              _scanResult = 'REAR VIEW CAMERA';
            },
            child: Transform.scale(
              scale: 1.15,
              child: Image.asset('assets/icons/qr_code_scanner.png',
                  color: Colors.white),
            ),
            backgroundColor: Colors.transparent,
            elevation: 0,
          ),
        ],
      ),
    );
  }
}
