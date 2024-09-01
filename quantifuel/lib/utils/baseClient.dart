import 'package:http/http.dart' as http;

// const baseUri = 'http://172.20.10.5:8080';
const baseUri = 'https://quantifuel-backend-qhfs4omr4a-el.a.run.app';

class BaseClient {
  var client = http.Client();

  Future<dynamic> get(String uri, Map<String, String> params) async {
    var url = Uri.parse(baseUri + uri).replace(queryParameters: params);
    var response = await client.get(url);

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to get data');
    }
  }

  Future<dynamic> post(String uri, dynamic body) async {
    var url = Uri.parse(baseUri + uri);
    var response = await client.post(url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body);
    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to post data');
    }
  }
}
