import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:vibration/vibration.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'dart:convert';

import '../utils/colors.dart';
import '../utils/client.dart';

import 'transactionInit.dart';

class QRScannerScreen extends StatefulWidget {
  final CameraDescription camera;
  final Function(String) updateResult;
  final Function getResult;
  final Function initTransactionPageSelect;
  final Key key;

  QRScannerScreen(
      {required this.camera,
      required this.updateResult,
      required this.getResult,
      required this.initTransactionPageSelect,
      required this.key})
      : super(key: key);

  @override
  _QRScannerScreenState createState() => _QRScannerScreenState(
      camera: camera,
      updateResult: updateResult,
      getResult: getResult,
      initTransactionPageSelect: initTransactionPageSelect);
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final CameraDescription camera;
  final Function(String) updateResult;
  final Function getResult;
  final Function initTransactionPageSelect;

  _QRScannerScreenState({
    required this.camera,
    required this.updateResult,
    required this.getResult,
    required this.initTransactionPageSelect,
  });

  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  late QRViewController? _qrViewController;

  final RegExp _pattern = RegExp(r'^[A-Za-z0-9]{6}-[A-Za-z0-9]{4}$');

  @override
  void dispose() {
    _qrViewController?.dispose();
    super.dispose();
  }

  // void _onQRViewCreated(QRViewController controller) {
  //   setState(() {
  //     _qrViewController = controller;
  //   });
  //   controller.scannedDataStream.listen((scanData) async {
  //     if (_pattern.hasMatch(scanData.code!)) {
  //       // Handle valid QR code
  //       setState(() {
  //         updateResult(scanData.code!);
  //       });
  //       _qrViewController?.pauseCamera();
  //       print('QR Code found: ${scanData.code}');

  //       var clientResponse = await Client().GetPump("48629922", scanData.code!);
  //       if (clientResponse != null) {
  //         var response = jsonDecode(clientResponse);
  //         print(response);
  //       } else {
  //         print('Failed to fetch pump info');
  //       }
  //       // await Client().InitTrans(scanData.code!);
  //     }
  //   });
  // }
  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      _qrViewController = controller;
    });
    controller.scannedDataStream.listen((scanData) async {
      if (_pattern.hasMatch(scanData.code!)) {
        bool? hasVibrator = await Vibration.hasVibrator();
        if (hasVibrator!) {
          // Trigger vibration
          Vibration.vibrate(duration: 300);
        }
        // Handle valid QR code
        setState(() {
          updateResult(scanData.code!);
        });
        _qrViewController?.pauseCamera();
        print('QR Code found: ${scanData.code}');

        var clientResponse = await Client().GetPump("48629922", scanData.code!);
        if (clientResponse != null) {
          var response = jsonDecode(clientResponse);

          var pump = response['pumpData'];
          // var pump = jsonDecode(pumpEx);
          print(pump);
          // Extract the values from the response
          String pin = pump['pin'];
          String ufsin = pump['ufsin'];
          String status = pump['status'];
          String? operator = pump['operatorName'];
          String fuelType = pump['fuelType'];
          String qrCodePath = pump['qrUrl'];

          initTransactionPageSelect(
              pin, ufsin, status, '48629922', operator, fuelType, qrCodePath);
          // Navigate to the TransactionInit widget
        } else {
          print('Failed to fetch pump info');
        }
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
              style: TextStyle(
                  fontSize: 20,
                  fontFamily: 'SansationBold',
                  fontWeight: FontWeight.bold),
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
              style: TextStyle(fontSize: 14, fontFamily: 'SansationLight'),
            ),
            // SizedBox(height: 20),
            // Text(
            //   'Scan Result: ${getResult()}',
            //   style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            // ),
          ],
        ),
      ),
    );
  }
}
