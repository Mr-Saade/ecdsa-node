import server from "./server";
import {secp256k1} from "@noble/curves/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak.js";
import {toHex} from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = secp256k1.getPublicKey(privateKey);
    const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
    setAddress(address);

    if (address) {
      const {
        data: {balance},
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Key in your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div>Address: {address.slice(0, 6)}...</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
