const hre = require("hardhat");

async function main() {
  const RandomNumberGenerator = await hre.ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const rn = await RandomNumberGenerator.deploy();
  await rn.deployed();
  console.log("Random number generator deployed to: " + rn.address);

  const ERC20Implementation = await hre.ethers.getContractFactory(
    "ERC20Implementation"
  );
  const erc20 = await ERC20Implementation.deploy();
  await erc20.deployed();
  console.log("ERC20 contract deployed to: " + erc20.address);

  const ERC721Implementation = await hre.ethers.getContractFactory(
    "ERC721Implementation"
  );
  const erc721 = await ERC721Implementation.deploy(rn.address, erc20.address);
  await erc721.deployed();
  console.log("ERC721 contract deployed to: " + erc721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });