# Starter Labs - Blockchain Developer Challenge

## Running tests

There are implemented tests to verify that the ERC20 supply is correct and that ERC721 tokens are correctly minted and owned based on a payment fee. Tests on the `RandomNumberGenerator` were not implemented due to the complexity needed to deploy the chainlink environment. Run tests with:

```
npx hardhat test
```

## Pre-requisites

- Unix/Linux system (or terminal with WSL)
- Node version 16.x
- Provide your data in the `.env.example` file in `/solidity` folder and rename it to `.env`.

## Express install and run

### One command install and run

You can install all the dependencies for both the smart contracts and frontend projects, deploy the smart-contracts and copy their information to the frontend folder and then run the frontend project in developer mode with a single command

```
./bootstrap.sh install
```

### Running dev in one command

If you want to deploy scripts, copy them to the frontend project and then run the frontend project in developer mode, just run

```
./bootstrap.sh
```

## Step by step install

To completely install and run the project we need to:

1. Smart-contracts
   1. Install dependencies
   2. Compile contracts
   3. Deploy to mumbai network
   4. Copy contract information to frontend folder
2. Frontend
   1. Install dependencies
   2. Run frontend project in developer mode

### Smart contracts

In the `/solidity` folder, run the commands below to install the dependencies, compile contracts and deploy them to the blockchain.

```
npm install                                         # Install all the dependencies
npx hardhat compile                                 # Compile the contracts
npx run scripts/deploy-bundle.js --network mumbai   # Deploy the contracts
```

The deploy script should output the deployed contracts addresses. Paste them in the corresponding fields in the `.contracts.example.js` file located in the `/frontend/config` folder and rename it to `.contracts.js`.

You also need to copy the contract ABIs from `/solidity/artifacts/[CONTRACT_NAME]/[CONTRACT_NAME].json` to the `/frontend/config` folder.

### Frontend

In the `/frontend` folder, run the commands below to install the dependencies and run the frontend project in developer mode.

```
npm install     # Install all the dependencies
npm run dev     # Run the frontend project in developer mode
```
