import 'package:flutter/material.dart';

import '../utils/colors.dart';

class Transactions extends StatefulWidget {
  @override
  _TransactionsState createState() => _TransactionsState();
}

class _TransactionsState extends State<Transactions> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('TRANSACTIONS',
                style: TextStyle(
                    fontSize: 30,
                    fontFamily: 'SansationBold',
                    fontWeight: FontWeight.bold,
                    color: Colors.black)),
            Text('WELCOME TO QUANTIFUEL!',
                style: TextStyle(
                    fontSize: 20,
                    fontFamily: 'SansationLight',
                    color: Colors.black)),
          ],
        ),
      ),
    );
  }
}