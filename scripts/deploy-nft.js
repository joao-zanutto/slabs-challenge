const hre = require("hardhat");

async function main() {
  const ERC721Implementation = await hre.ethers.getContractFactory(
    "ERC721Implementation"
  );
  const erc721 = await ERC721Implementation.deploy(
    "0x6ab94D18784ED5020457DAe7F3EE29865a5A0CD4"
  );
  await erc721.deployed();
  console.log("ERC721 contract deployed to: " + erc721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
