import 'package:flutter/material.dart';

import '../utils/colors.dart';

class Profile extends StatefulWidget {
  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('PROFILE',
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
