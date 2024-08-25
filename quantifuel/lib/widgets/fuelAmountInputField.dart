import 'package:flutter/material.dart';
import 'package:Quantifuel/utils/colors.dart';

class FuelAmountInputField extends StatefulWidget {
  @override
  _FuelAmountInputFieldState createState() => _FuelAmountInputFieldState();
}

class _FuelAmountInputFieldState extends State<FuelAmountInputField> {
  String _selectedInputType = 'Li.'; // Default selection
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    double screenHeight = MediaQuery.of(context).size.height;
    double scaleFactor = MediaQuery.of(context).textScaleFactor;

    return Container(
      padding: EdgeInsets.all(6.0), // Padding inside the rounded container
      decoration: BoxDecoration(
        color: Colors.white, // Background color inside the rounded container
        borderRadius:
            BorderRadius.circular(12.0), // Adjust the radius as needed
        border: Border.all(
          color: AppColors.appBarTopRed, // Border color
          width: 2.0, // Border width
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              DropdownButton<String>(
                value: _selectedInputType,
                items: ['Li.', 'Rs.', 'Full']
                    .map((String value) => DropdownMenuItem<String>(
                          value: value,
                          child: Text(value,
                              style: TextStyle(
                                  fontSize: 14 * scaleFactor,
                                  fontFamily: 'Sansation')),
                        ))
                    .toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedInputType = newValue!;
                    _controller.clear(); // Clear input when type changes
                  });
                },
              ),
              SizedBox(
                height: screenHeight * 0.02,
                width: screenHeight * 0.01,
              ),
              if (_selectedInputType == 'Li.' || _selectedInputType == 'Rs.')
                Container(
                  width:
                      screenWidth * 0.70, // Adjust the width of the TextField
                  child: TextField(
                    controller: _controller,
                    keyboardType: TextInputType.number,
                    cursorColor: AppColors.appBarBottomRed,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: _selectedInputType == 'Li.'
                          ? 'Enter Fuel Amount in Litres'
                          : 'Enter Fuel Amount in Rupees',
                      labelStyle: TextStyle(
                          fontSize: 14 * scaleFactor,
                          fontFamily: 'Sansation',
                          color: Color.fromRGBO(0, 0, 0, 0.35)),
                      contentPadding: EdgeInsets.symmetric(
                          vertical: screenHeight * 0.01,
                          horizontal: screenWidth * 0.03),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: AppColors.appBarTopRed,
                          width: 2.0,
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: Colors.grey,
                          width: 1.0,
                        ),
                      ),
                    ),
                    style: TextStyle(
                      fontSize: 14 * scaleFactor,
                      fontFamily: 'Sansation',
                    ),
                    onChanged: (text) {
                      // Handle any input-specific logic here
                    },
                  ),
                )
              else if (_selectedInputType == 'Full')
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Full tank selected.',
                      style: TextStyle(
                        fontSize: 14 * scaleFactor,
                        fontFamily: 'Sansation',
                        color: Colors.black54,
                      ),
                      textAlign: TextAlign.left,
                    ),
                    Text('Fuel will be filled to the brim.',
                        style: TextStyle(
                          fontSize: 14 * scaleFactor,
                          fontFamily: 'Sansation',
                          color: Colors.black54,
                        ),
                        textAlign: TextAlign.left),
                  ],
                ),
            ],
          ),
        ],
      ),
    );
  }
}
