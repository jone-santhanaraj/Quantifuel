const crypto = require('crypto');

const print = require('./consoleUtils');

const secretKey = process.env.WALLET_BALANCE_SECRET_KEY;

const algorithm = 'aes-256-ctr';

const iv = crypto.randomBytes(16);

const encryptBalance = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

const decryptBalance = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, 'hex')
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString();
};

module.exports = { encryptBalance, decryptBalance };
