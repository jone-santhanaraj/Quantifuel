import 'package:flutter/material.dart';
import 'dart:convert';

import '../utils/client.dart';

class TransactionInit extends StatefulWidget {
  final String pin;
  final String ufsin;
  final String status;
  final String uuin;
  final String operator;
  final String fuelType;

  TransactionInit(
      {required this.pin,
      required this.ufsin,
      required this.status,
      required this.uuin,
      required this.operator,
      required this.fuelType});

  @override
  _TransactionInitState createState() => _TransactionInitState(
      pin: pin,
      ufsin: ufsin,
      status: status,
      uuin: uuin,
      operator: operator,
      fuelType: fuelType);
}

class _TransactionInitState extends State<TransactionInit> {
  final String pin;
  final String ufsin;
  final String status;
  final String uuin;
  final String operator;
  final String fuelType;

  _TransactionInitState(
      {required this.pin,
      required this.ufsin,
      required this.status,
      required this.uuin,
      required this.operator,
      required this.fuelType});

  Future<String> GetStationName(ufsin) async {
    var stationNameRes = await Client().GetFuelStationName(ufsin);
    print('GetSN: ${stationNameRes}');
    String stationName = jsonDecode(stationNameRes)['name'];
    print('Station Name: $stationName');
    return stationName;
  }

  void InitTrans(pin, ufsin, uuin) {
    print("Init Trans Pressed");
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
              Text('Fuel Station Name:', style: TextStyle(fontSize: 12)),
              FutureBuilder<String>(
                future: GetStationName(ufsin),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return CircularProgressIndicator(); // Display a loading indicator while waiting
                  } else if (snapshot.hasError) {
                    return Text('Error: ${snapshot.error}');
                  } else if (snapshot.hasData) {
                    return Text(snapshot.data!, style: TextStyle(fontSize: 20));
                  } else {
                    return Text('No Station Name Available');
                  }
                },
              ),
              Text('Fuel Type:', style: TextStyle(fontSize: 12)),
              Text('$fuelType', style: TextStyle(fontSize: 20)),
              Text('Operator:', style: TextStyle(fontSize: 12)),
              Text('$operator', style: TextStyle(fontSize: 20)),
              Text('Status:', style: TextStyle(fontSize: 12)),
              Text('$status', style: TextStyle(fontSize: 20)),
              Text('Enter Fuel Amount:', style: TextStyle(fontSize: 12)),
              TextField(
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Enter Fuel Amount in Litres',
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  // Initiate transaction
                  // Client().InitTrans(pin, ufsin, uuin);
                  InitTrans(pin, ufsin, uuin);
                },
                child: Text('Initiate Transaction'),
              ),
            ]),
      ),
    );
  }
}
