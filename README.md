# NFT Ticketing System - Smart Contracts
This repository contains the backend smart contracts for a decentralized ticketing application built on the Ethereum blockchain. The system uses a factory pattern to allow whitelisted creators to deploy unique NFT collections (ERC721) for their events.

## About The Project
This project provides the on-chain logic for a dApp where users can mint NFT-based tickets. The core architecture consists of two main contracts:

- EventManager.sol: A factory contract that acts as the central administrative hub. It manages a whitelist of authorized event creators and is responsible for deploying new event contracts.

- EventTicket.sol: An ERC721 contract template. A new instance of this contract is deployed for each event, representing a unique collection of NFT tickets. It includes logic for minting, ownership, and ticket redemption.

## Getting Started
Follow these steps to get a local copy up and running for development and testing.

### Prerequisites
Make sure you have the following software installed on your machine:

- Node.js (v18.x or later recommended) & npm

```Bash
node -v
npm -v
```

- Ganache UI: A personal blockchain for local development. Download from Truffle Suite.

### Installation
1. Clone the repository:

```Bash
git clone https://github.com/Juanmadiaz45/dapp-tickets-backend
```

2. Navigate into the project directory:

```Bash
cd dapp-tickets-backend
```

3. Install the necessary npm packages:

```Bash
npm install
```

## Usage
This section explains how to compile, test, and deploy the contracts.

### Compile Contracts
To compile the smart contracts and check for errors, run the following command:

```Bash
npx hardhat compile
```

This will create an artifacts directory with the contract ABIs and bytecode.

### Run Tests
To ensure the contracts are functioning correctly, run the automated test suite:

```Bash
npx hardhat test
```

All tests located in the test/ directory will be executed.

### Deploy to a Local Network (Ganache)
Follow these steps to deploy and interact with the contracts on your personal Ganache blockchain.

1. Start Ganache
Open the Ganache application and start a new "Quickstart" workspace. Keep it running in the background.

2. Configure Hardhat
Ensure your hardhat.config.js is configured to connect to Ganache. The networks section should include:

```JavaScript
// hardhat.config.js
...
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Default Ganache RPC Server
    },
  },
...
```

3. Deploy the EventManager Contract
This command uses Hardhat Ignition to deploy the main factory contract.

```Bash
npx hardhat ignition deploy ./ignition/modules/Deploy.js --network ganache
```

After a successful deployment, the console will output the address of the newly deployed EventManager contract. Copy this address.

4. Interact with the Deployed Contract
To test the full functionality (whitelisting, event creation, minting), you need to update and run the interaction script.

- Open the scripts/interact.js file.

- Paste the new contract address you copied into the eventManagerAddress variable.

- Run the script:

```Bash
npx hardhat run scripts/interact.js --network ganache
```

This will execute the script against your deployed contract on Ganache, demonstrating the full workflow.