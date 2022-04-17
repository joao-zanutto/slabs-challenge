const hre = require("hardhat");

async function main() {
  const RandomNumberGenerator = await hre.ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const rn = await RandomNumberGenerator.deploy();
  await rn.deployed();
  console.log("Random number generator deployed to: " + rn.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
