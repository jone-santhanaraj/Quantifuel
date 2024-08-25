import 'package:flutter/material.dart';

import '../utils/colors.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('HOME',
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
