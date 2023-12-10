# Secure Fund Transfer with Digital Signatures

This project implements a secure fund transfer system using the Elliptic Curve Digital Signature. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. Initially, the application allowed clients to transfer funds from any account to another, posing a security risk. To enhance security, digital signatures are now employed to ensure that only users with the appropriate private key can create a signature, allowing them to move funds between accounts.

## Project Overview

- **Digital Signatures**: The application incorporates digital signatures to enforce that only users with the correct private key can authorize fund transfers.

- **Public Key Cryptography**: Users verify their ownership of the private key corresponding to their wallet address by signing transactions. This adds an additional layer of security to the fund transfer process.

- **Client-Side Private Key Input (For Testing and Learning)**: For testing and learning purposes, users key in their private key in the client application. In real-world scenarios, private keys should never be exposed or shared.

- **Transaction Authorization**: When a user initiates a fund transfer, the transaction is signed with the client's private key. The client application sends this signature to the server, which then verifies and authorizes the transaction.

## How it Works

1. **Private Key Input**: Users input their private key into the client application. In practice, this step should be handled securely.

2. **Transaction Signing**: When executing a transfer function, the transaction is signed with the client's private key, ensuring the authenticity of the transaction.

3. **Server Verification**: The client application sends the signature to the server for verification. The server checks the validity of the signature and authorizes the transaction only if the signature is valid.

4. **Public Key Cryptography**: The person sending the transaction verifies their ownership of the private key by signing the transaction. This ensures that only the rightful owner can initiate fund transfers.

5. **Preventing Replay Attacks**: Even if someone intercepts a valid signature, they cannot replay the transfer by sending it back to the server. The server checks the freshness and authenticity of each signature.

## Note

- Private keys should never be exposed or shared in a real-world scenario. This practice is only for educational and testing purposes.

### Quickstart

1. Clone the repository:

   ```sh
   git clone https://github.com/Mr-Saade/ecdsa-node
   cd ecdsa-node
   ```

### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder
2. Run `npm install` to install all the depedencies
3. Run `node index` to start the server

The application should connect to the default server port (3042) automatically!

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.
