const hre = require("hardhat");

async function main() {
  const RandomNumberGenerator = await hre.ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const rn = await RandomNumberGenerator.deploy();
  await rn.deployed();
  console.log('RAN_GENERATOR_ADDRESS="' + rn.address + '"');

  const ERC20Implementation = await hre.ethers.getContractFactory(
    "ERC20Implementation"
  );
  const erc20 = await ERC20Implementation.deploy();
  await erc20.deployed();
  console.log('ERC20_CONTRACT_ADDRESS= "' + erc20.address + '"');

  const ERC721Implementation = await hre.ethers.getContractFactory(
    "ERC721Implementation"
  );
  const erc721 = await ERC721Implementation.deploy(rn.address, erc20.address);
  await erc721.deployed();
  console.log('ERC721_CONTRACT_ADDRESS="' + erc721.address + '"');
  erc20.transfer(erc721.address, ethers.utils.parseEther("1000000000"));
  await rn.transferOwnership(erc721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
