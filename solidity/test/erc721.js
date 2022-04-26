const { expect } = require("chai");
const { ethers } = require("hardhat");
const { smock } = require("@defi-wonderland/smock");

describe("ERC721 Contract", function () {
  var fakeNumberGenerator, owner, erc721, erc20;

  // Create the fakeNumberGenerator to be used for all tests
  before(async function () {
    fakeNumberGenerator = await smock.fake("RandomNumberGenerator");
    [owner] = await ethers.getSigners();

    fakeNumberGenerator.getUserRandomNumbers
      .whenCalledWith(owner.address)
      .returns([1, 2]);
  });

  // Create the erc721 contract to be used for each tests, and load the tokens to the erc721 contract
  beforeEach(async function () {
    const ERC20Implementation = await ethers.getContractFactory(
      "ERC20Implementation"
    );
    erc20 = await ERC20Implementation.deploy();
    await erc20.deployed();

    const ERC721Implementation = await ethers.getContractFactory(
      "ERC721Implementation"
    );
    erc721 = await ERC721Implementation.deploy(
      fakeNumberGenerator.address,
      erc20.address
    );
    await erc721.deployed();

    erc20.transfer(erc721.address, ethers.utils.parseEther("1000000000"));
  });

  it("Should create a token to owner given that he has enough tokens and has allowed it", async function () {
    await erc721.donateTokens(owner.address);
    await erc20.approve(erc721.address, ethers.utils.parseEther("15"));
    await erc721.connect(owner).awardItem();
    const monsters = await erc721.getMonsters(owner.address);

    expect(monsters.length).to.equal(1);
  });

  it("Should verify if user has enough tokens and return an error message if he/she doesn't", async function () {
    try {
      await erc721.connect(owner).awardItem();
    } catch (error) {
      expect(error.message).to.contain("Not enough tokens");
    }
    const monsters = await erc721.getMonsters(owner.address);

    expect(monsters.length).to.equal(0);
  });

  it("Should verify if user has provided enough allowance and return an error message he/she hasn't", async function () {
    await erc721.donateTokens(owner.address);

    try {
      await erc721.connect(owner).awardItem();
    } catch (error) {
      expect(error.message).to.contain("Not enough allowance");
    }
    const monsters = await erc721.getMonsters(owner.address);

    expect(monsters.length).to.equal(0);
  });
});
