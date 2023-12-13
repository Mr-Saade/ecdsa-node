const {secp256k1} = require("@noble/curves/secp256k1");
const {utf8ToBytes} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "156b9d831eff7194aa466f7006092c9a9b2fe8cc": 100,
  "155513dd683977a8e5220e747564c87d98a94505": 50,
  "7743950f2709ae20fa03b75bba6ef1e9d64d72f6": 75,
};

app.get("/balance/:address", (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({balance});
});
let transactionData;
app.post("/send", (req, res) => {
  /*- recover the publickey(user wallet address) from the signed transaction signature
  -transfer transaction should only go through if authorized by the server after derived publickey from signature */
  let transactionData, senderAddress, isSigned;
  try {
    const reviverBigInt = (key, value) =>
      key === "r" || key === "s" || key === "recovery" ? BigInt(value) : value;
    console.log("Received request:", req.body);
    const {transactionJson, transactionSig} = req.body;
    const transactionSignatureObject = JSON.parse(
      transactionSig,
      reviverBigInt
    );
    const transactionSignature = new secp256k1.Signature(
      transactionSignatureObject.r,
      transactionSignatureObject.s,
      transactionSignatureObject.recovery
    );
    transactionData = JSON.parse(transactionJson);
    const transactionHash = keccak256(utf8ToBytes(transactionJson));
    const publicKey = transactionSignature
      .recoverPublicKey(transactionHash)
      .toRawBytes();
    senderAddress = keccak256(publicKey.slice(1)).slice(-20);
    isSigned = secp256k1.verify(
      transactionSignature,
      transactionHash,
      publicKey
    );
  } catch (err) {
    console.error(err);
  }
  if (!isSigned || senderAddress != transactionData.senderAddress) {
    res.status(400).send({message: "Invalid signature. Authorization failed."});
    return;
  }

  setInitialBalance(senderAddress);
  setInitialBalance(transactionData.recipient);

  if (balances[senderAddress] < transactionData.amount) {
    res.status(400).send({message: "Not enough funds!"});
  } else {
    balances[senderAddress] -= transactionData.amount;
    balances[transactionData.recipient] += transactionData.amount;
    res.send({balance: balances[senderAddress]});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
