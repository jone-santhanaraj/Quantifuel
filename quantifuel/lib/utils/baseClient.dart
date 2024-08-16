import 'package:http/http.dart' as http;

const baseUri = 'http://127.0.0.1:5344';

class BaseClient {
  var client = http.Client();

  Future<dynamic> post(String uri, dynamic body) async {
    var url = Uri.parse(baseUri + uri);
    var response = await client.post(url, body: body);
    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception('Failed to post data');
    }
  }
}
