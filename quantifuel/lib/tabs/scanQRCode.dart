import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

import '../utils/colors.dart';

class QRScannerScreen extends StatefulWidget {
  final CameraDescription camera;
  final Function(String) updateResult;
  final Function getResult;
  final Key key;

  QRScannerScreen(
      {required this.camera,
      required this.updateResult,
      required this.getResult,
      required this.key})
      : super(key: key);

  @override
  _QRScannerScreenState createState() => _QRScannerScreenState(
      camera: camera, updateResult: updateResult, getResult: getResult);
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final CameraDescription camera;
  final Function(String) updateResult;
  final Function getResult;

  _QRScannerScreenState({
    required this.camera,
    required this.updateResult,
    required this.getResult,
  });

  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  late QRViewController? _qrViewController;

  final RegExp _pattern = RegExp(r'^[A-Za-z0-9]{6}-[A-Za-z0-9]{4}$');

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
      if (_pattern.hasMatch(scanData.code!)) {
        // Handle valid QR code
        setState(() {
          updateResult(scanData.code!);
        });
        _qrViewController?.pauseCamera();
        print('QR Code found: ${scanData.code}');
      }
    });
  }

  void resetScanner() {
    setState(() {
      _qrViewController?.resumeCamera();
      updateResult('REAR VIEW CAMERA'); // Reset the scan result
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
              'Scan Result: ${getResult()}',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
