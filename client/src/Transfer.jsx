import {useState} from "react";
import server from "./server";
import {secp256k1} from "@noble/curves/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak.js";
import {utf8ToBytes} from "ethereum-cryptography/utils.js";

function Transfer({address, setBalance, privateKey, setPrivateKey}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    let transactionJson, transactionSignature;
    try {
      /*When we hit transfer, the client app should;
  -sign the transaction with the user privateKey
   -send the signed transaction signature to the server*/
      const transactionData = {
        senderAddress: address,
        recipient,
        amount: parseInt(sendAmount),
      };
      transactionJson = JSON.stringify(transactionData);
      transactionSignature = secp256k1.sign(
        keccak256(utf8ToBytes(transactionJson)),
        privateKey
      );
    } catch (err) {
      console.error(err);
    }

    try {
      const {
        data: {balance},
      } = await server.post(`send`, {
        transactionJson,
        transactionSignature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
