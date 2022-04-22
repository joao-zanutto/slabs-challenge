
cd solidity

# INSTALL SMART-CONTRACT DEPENDENCIES
if [ "$1" = "install" ]
then
    echo "installing smart-contract dev env dependencis..."
    npm install
    echo "installing hardhat globally..."
    npm i -g hardhat
fi

# DEFINE VARIABLES FOR SMART-CONTRACT FILENAME
CURRENT_TIMESTAMP=$(date +"%Y-%m-%d-%H:%M:%S")
CONTRACT_ADDRESS_FILENAME="addresses_$CURRENT_TIMESTAMP"

# RUN DEPLOY SCRIPT AND SAVE ADDRESSES TO FILE IN ./artifacts
npx hardhat compile
npx hardhat run scripts/deploy-bundle.js --network mumbai > artifacts/$(echo "$CONTRACT_ADDRESS_FILENAME")

# PARSE THE ADDRESSES FROM THE FILE IN THE ARTIFACTS FOLDER TO A NEW FILE THAT WILL BE MOVED TO FRONTENDS
echo "export const $(grep RAN_GENERATOR_ADDRESS artifacts/$CONTRACT_ADDRESS_FILENAME)" >> .contracts.js
echo "export const $(grep ERC20_CONTRACT_ADDRESS artifacts/$CONTRACT_ADDRESS_FILENAME)" >> .contracts.js
echo "export const $(grep ERC721_CONTRACT_ADDRESS artifacts/$CONTRACT_ADDRESS_FILENAME)" >> .contracts.js

# COPY FILE WITH ADDRESSES AND ABIS TO FRONTEND FOLDER
mv .contracts.js ../frontend/config/.contracts.js
cp artifacts/contracts/RandomNumberGenerator.sol/RandomNumberGenerator.json ../frontend/config/RandomNumberGenerator.json
cp artifacts/contracts/ERC20Implementation.sol/ERC20Implementation.json ../frontend/config/ERC20Implementation.json
cp artifacts/contracts/ERC721Implementation.sol/ERC721Implementation.json ../frontend/config/ERC721Implementation.json

cd ../frontend

# INSTALL FRONTEND DEPENDENCIES
if [ "$1" = "install" ]
then
    echo "installing fontend dependencis..."
    npm install
fi

npm run dev