import 'package:flutter/foundation.dart';
import 'baseClient.dart';
import 'dart:convert';

class Client {
  Future<dynamic> InitTrans(upinin) async {
    var uuin = "48629922";
    var upin = upinin;
    var amount = 10;
    var body = jsonEncode({"uuin": uuin, "upin": upin, "amount": amount});
    var response = await BaseClient()
        .post('/system/init-transaction', body)
        .catchError((err) {
      print(err);
    });
    if (response != null) {
      print(response);
      debugPrint(response);
      return response;
    } else {
      print('Failed to post data');
      debugPrint('Failed to post data');
      return null;
    }
  }

  Future<dynamic> GetPump(String uuin, String upin) async {
    var params = {
      "uuin": uuin,
      "upin": upin,
    };

    var response =
        await BaseClient().get('/system/getPump', params).catchError((err) {
      print(err);
    });

    if (response != null) {
      print(response);
      debugPrint(response);
      return response;
    } else {
      print('Failed to fetch pump info');
      debugPrint('Failed to fetch pump info');
      return null;
    }
  }

  Future<dynamic> GetFuelStationName(String? ufsin) async {
    var UFSIN = ufsin.toString();
    var params = {
      "ufsin": UFSIN,
    };

    var response = await BaseClient()
        .get('/system/getFuelStationName', params)
        .catchError((err) {
      print(err);
    });

    if (response != null) {
      print(response);
      debugPrint(response);
      return response;
    } else {
      print('Failed to fetch fuel station name');
      debugPrint('Failed to fetch fuel station name');
      return null;
    }
  }
}
