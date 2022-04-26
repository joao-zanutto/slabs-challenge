const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 Contract", function () {
  it("Should have a total supply of 10 ** 9", async function () {
    const ERC20Implementation = await ethers.getContractFactory(
      "ERC20Implementation"
    );
    const erc20 = await ERC20Implementation.deploy();
    await erc20.deployed();

    const totalSupply = await erc20.totalSupply();
    const expected = ethers.utils.parseEther("1000000000");

    expect(totalSupply).to.equal(expected);
  });
});
