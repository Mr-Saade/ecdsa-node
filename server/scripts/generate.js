const {secp256k1} = require("ethereum-cryptography/secp256k1");
const {hexToBytes, toHex, utf8ToBytes} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");

const privateKey = secp256k1.utils.randomPrivateKey();
console.log(`private key: `, toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);
const walletAddress = keccak256(publicKey.slice(1)).slice(-20);
console.log(`public key: `, toHex(publicKey));
console.log(`wallet address: `, toHex(walletAddress));
