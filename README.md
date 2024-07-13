# Quantifuel

Quantifuel is a project aimed at enhancing fuel station management by improving accuracy in fuel dispensing and transaction transparency.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Quantifuel is designed to address the challenges faced in fuel stations, focusing on:

- Ensuring accurate fuel dispensing through serialized pumps.
- Enhancing transaction transparency for customers.
- Streamlining fuel station management operations.

## Features

- **Fuel Station Management**

  - Create, update, and manage fuel stations.
  - Assign serialized pumps to each station.

- **Pump Serialization**

  - Generate unique identification numbers (UPINs) for each pump.
  - QR code generation for easy identification and tracking.

- **Transaction Transparency**
  - Record and monitor fuel transactions.
  - Provide customers with transaction details for transparency.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB (using Mongoose ODM)
- **QR Code Generation**: qrcode npm module
- **Image Processing**: sharp npm module
- **Other Tools**: crypto, fs (File System), path

## Installation

1. Clone the repository:

- git clone https://github.com/jone-santhanaraj/Quantifuel.git
- cd Quantifuel

2. Install dependencies:
- npm install

3. Set up environment variables:

- Create a `.env` file in the root directory.
- Define environment variables like `PORT`, `MONGODB_URI`, etc.

4. Start the server:

- npm start

## Usage

- **Creating a Fuel Station**:
- Use the API endpoint to create a new fuel station.
- Provide required details such as name and address.

- **Managing Pumps**:
- Generate UPINs for pumps associated with each fuel station.
- Monitor pump status and transaction history.

## API Documentation

- **Endpoints**:
- `POST /api/fuel-stations`: Create a new fuel station.
- `POST /api/fuel-stations/:ufsin/pumps`: Create a pump for a specific fuel station.
- `GET /api/fuel-stations/:ufsin/pumps/:upin/qr-code`: Retrieve QR code for a pump.

- **Detailed API documentation**: Available in `API.md`.

## Contributing

Contributions are welcome! Here’s how you can contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under a closed source license - see the LICENSE file for details.
