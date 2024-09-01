//------------------------------
//  AUTHOR: jone_santhanaraj
//------------------------------

// REQUIRE LIBRARIES / START

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const qr = require('qrcode');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const socketIo = require('socket.io');
const ioClient = require('socket.io-client');

// var child_proces s = require('child_process');

// child_process.execSync('npm install', { stdio: [0, 1, 2] });

const serveIndex = require('serve-index'); //dev

// REQUIRE LIBRARIES / END

// LIBRARY CONFIG / START

const quantifuel = express();
dotenv.config();
const server = http.createServer(quantifuel);
const io = socketIo(server);

const pumpSocket = ioClient('http://localhost:8081');

// LIBRARY CONFIG / END

// REQUIRE MODULES / START

const print = require('./modules/utils/consoleUtils');
const { mongodb, connectMongoose } = require('./modules/config/mongoose');

const routes = require('./modules/routes');

const {
  fetchFuelPrices,
  getFuelPrices,
  fuelPrices,
} = require('./modules/utils/fuelPrices');

// REQUIRE MODULES / END

// VARIABLES AND ATTRIBUTES / START

const PROTOCOL = process.env.PROTOCOL || 'http';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const allowedOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:5345';

const logFileName = process.env.LOG_FILE_NAME;

let MongodbState = 0;

// VARIABLES AND ATTRIBUTES / END

// MIDDLEWARES / START

quantifuel.use(
  cors({
    origin: allowedOrigins.split(','),
  })
);

pumpSocket.on('pumpData', (data) => {
  print.log('Received data from PumpServer:', data);
  // Broadcast data to all connected clients
  io.emit('updatePumpData', data);
});

//Handle client connections
io.on('connection', (socket) => {
  print.log('Client connected:', socket.id);

  // Handle client disconnection
  socket.on('disconnect', () => {
    print.log('Client disconnected:', socket.id);
  });
});

quantifuel.use(express.json());

quantifuel.use(
  '/qrcodes',
  express.static(path.join(__dirname, './public/qrcodes'))
);

quantifuel.use(
  '/qrcodes',
  serveIndex(path.join(__dirname, './public/qrcodes'), { icons: true })
); //dev

quantifuel.use(routes);

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem',
  },
});

// MIDDLEWARES / END

// GET - POST - PUT - DELETE / START

quantifuel.get('/api', (req, res) => {
  print.log('someone accessed the server');
  res.send('Welcome to QuantiFuel!');
});

quantifuel.get('/api/test-get-pk', (req, res) => {
  const { clientNonce } = req.query;
  print.log('publicKey fetched: ', publicKey);
  res
    .status(200)
    .json({ clientNonce, serverNonce: publicKey, statusCode: 200 });
});
quantifuel.get('/api/test-conn', (req, res) => {
  if (MongodbState === 1) {
    const { encryptedData } = req.query;
    if (!encryptedData) {
      res.status(400).json({ status: 'BAD REQUEST', statusCode: 400 });
    }
    try {
      const clientNonce = crypto
        .privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'))
        .toString('utf8');

      print.log('Decrypted Client Nonce:', clientNonce.toString());
      res.status(200).json({
        decryptedClientNonce: clientNonce.toString(),
        statusCode: 200,
      });
    } catch (err) {
      print.error('Error on connection test request: \n', err);
      res
        .status(500)
        .json({ status: 'INTERNAL SERVER ERROR', statusCode: 500 });
    }
  } else {
    res.status(500).json({ status: 'INTERNAL SERVER ERROR', statusCode: 500 });
  }
});

quantifuel.get('/api/initTrans', (req, res) => {
  res.send({
    trans_id: '01nhhhad193b1hd8212b',
    pump_id: 'sh113b1i',
    bunk_id: 'asdh112312j',
    bunk_loc_coords: '123123-1231233-4556435-3454634',
    isMultiFuelType: 0,
    fuel_types: ['petrol'],
    user_id: '1021123447',
    user_loc_coords: '1012313-2112312-1231123-3244234',
  });
});

// GET - POST - PUT - DELETE / END

// SERVER CONFIG / START

const startServer = async () => {
  print.log('Initiating...');
  const mongodbConnectionResponse = await connectMongoose({
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  if (mongodbConnectionResponse.status === 200) {
    print.success(
      'Server is up and running, listening at',
      `${PROTOCOL}://${HOST}:${PORT}/`
    );
    MongodbState = 1;
  } else if (mongodbConnectionResponse.status === 500) {
    print.failed(
      `Server is running at: ${PROTOCOL}://${HOST}:${PORT}/ but not ready to accept requests`
    );
    MongodbState = 0;
  }
  // fetchFuelPrices();
  // getFuelPrices();
  // print.log(fuelPrices);
};

const serve = server.listen(PORT, HOST, startServer);

const clearLogFile = () => {
  if (logFileName) {
    const logFilePath = path.join(__dirname, logFileName);

    fs.readFile(logFilePath, 'utf8', (err) => {
      if (err) {
        print.error('Error reading the log file:', err);
      } else {
        fs.truncate(logFilePath, 0, (truncateErr) => {
          if (truncateErr) {
            print.error('Error clearing the log file:', truncateErr);
          } else {
            print.info(
              `Log file "${logFileName}" has been cleared successfully.`
            );
          }
        });
      }
    });
  } else {
    print.warn('Log file name is not set.');
  }
};

const shutdownServer = async () => {
  await setTimeout(async () => {
    MongodbState = 0;
    await serve.close(() => {
      print.log(
        `Server listening at ${PROTOCOL}://${HOST}:${PORT}/ has been stopped on command.`
      );
    });
  }, 1000);
  setTimeout(() => {
    process.exit(0);
  }, 1000);
};

const restartServer = async () => {
  await setTimeout(async () => {
    await serve.close(() => {
      print.log(
        `Server listened at ${PROTOCOL}://${HOST}:${PORT}/ has been stopped for a restart.`
      );
    });
  }, 1000);
  setTimeout(() => {
    print.log('Attempting to start the server again after restart...');
  }, 1500);
  setTimeout(async () => {
    await serve.listen(PORT, HOST, startServer);
  }, 3000);
};

const processConsoleCommand = (command) => {
  if (command === 'clearlog') {
    clearLogFile();
  } else if (command === 'stop') {
    print.log('Stopping server...');
    shutdownServer();
  } else if (command === 'restart') {
    print.log('Restarting server...');
    restartServer();
  } else if (command === '') {
    print.info('-');
  } else {
    print.warn(`Unable to recognize the command: "${command}"`);
  }
};

process.stdin.on('data', (data) => {
  const command = data.toString().trim();
  processConsoleCommand(command);
});

// SERVER CONFIG / END
