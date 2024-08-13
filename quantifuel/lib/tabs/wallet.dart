import 'package:flutter/material.dart';

import '../utils/colors.dart';

class Wallet extends StatefulWidget {
  @override
  _WalletState createState() => _WalletState();
}

class _WalletState extends State<Wallet> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('WALLET',
                style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Colors.black)),
            Text('WELCOME TO QUANTIFUEL!',
                style: TextStyle(fontSize: 20, color: Colors.black)),
          ],
        ),
      ),
    );
  }
}
