import 'package:flutter/foundation.dart';
import 'baseClient.dart';
import 'dart:convert';
// import 'package:crypto/crypto.dart';
import 'dart:math';
import 'package:encrypt/encrypt.dart';
import 'package:pointycastle/asymmetric/api.dart';
import 'package:pointycastle/asymmetric/rsa.dart';

class Client {
  Future<bool> TestConnectivity() async {
    try {
      final clientNonce = _generateNonce(16);
      final res = await BaseClient().get('/api/test-get-pk', {
        'clientNonce': clientNonce,
      });
      final response = jsonDecode(res);
      final getKeyStatusCode = jsonDecode(res)['statusCode'];

      if (getKeyStatusCode == 200) {
        final serverNonce = jsonDecode(res)['serverNonce'].toString();
        final clientNonceRes = jsonDecode(res)['clientNonce'].toString();
        print(serverNonce);
        print(clientNonceRes);
        if (clientNonce == clientNonceRes) {
          // final parser = RSAKeyParser();
          // final RSAPublicKey publicKey =
          //     parser.parse(serverNonce) as RSAPublicKey;
          // final encrypter = Encrypter(RSA(publicKey: publicKey));
          // final encryptedClientNonce = encrypter.encrypt(clientNonce).base64;

          // final connRes = await BaseClient().get('/api/test-conn', {
          //   'encryptedData': encryptedClientNonce,
          // });
          // final connectionResponse = jsonDecode(connRes);
          // final connectionTestStatusCode = jsonDecode(connRes)['statusCode'];

          // if (connectionTestStatusCode == 200) {
          //   final serverNonceRes =
          //       jsonDecode(connRes)['serverNonce'].toString();
          //   final decryptedCientNonce =
          //       jsonDecode(connRes)['decryptedClientNonce']
          //           .toString(); // serverNonce is a string
          //   if (serverNonce == serverNonceRes ||
          //       clientNonce == decryptedCientNonce) {
          //     return true;
          //   } else {
          //     return false;
          //   }
          // } else {
          //   return false;
          // }
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (e) {
      print(e);
      return false;
    }
  }

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
      // print(response);
      // debugPrint(response);
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
      // print(response);
      // debugPrint(response);
      return response;
    } else {
      print('Failed to fetch fuel station name');
      debugPrint('Failed to fetch fuel station name');
      return null;
    }
  }
}

String _generateNonce(int length) {
  const charset =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
  final random = Random.secure();
  return List.generate(length, (_) => charset[random.nextInt(charset.length)])
      .join('');
}
