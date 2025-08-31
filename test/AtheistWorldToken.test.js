const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AtheistWorldToken", function () {
  let token, owner, user1, user2;

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("AtheistWorldToken");
    [owner, user1, user2] = await ethers.getSigners();
    token = await Token.deploy();
    await token.deployed();
  });

  it("Deployment: Sets the correct name and symbol", async function () {
    expect(await token.name()).to.equal("AtheistWorldToken");
    expect(await token.symbol()).to.equal("AWT");
  });

  it("Minting: Owner can mint tokens", async function () {
    await token.connect(owner).mint(user1.address, ethers.parseEther("1000"));
    expect(await token.balanceOf(user1.address)).to.equal(ethers.parseEther("1000"));
  });

  it("Staking: User can stake and balance updates", async function () {
    await token.connect(owner).mint(user1.address, ethers.parseEther("100"));
    await token.connect(user1).approve(token.target, ethers.parseEther("100"));
    await token.connect(user1).stake(ethers.parseEther("100"));
    expect(await token.stakes(user1.address).amt).to.equal(ethers.parseEther("100"));
  });

  it("Unstaking and Reward Claim: Claims reward", async function () {
    await token.connect(owner).mint(user1.address, ethers.parseEther("100"));
    await token.connect(user1).approve(token.target, ethers.parseEther("100"));
    await token.connect(user1).stake(ethers.parseEther("100"));
    await ethers.provider.send("evm_increaseTime", [86400 * 30]); // 30 days ahead
    await token.connect(user1).unstake(ethers.parseEther("100"));
    const reward = await token.calculateReward(user1.address);
    expect(reward).to.be.greaterThan(0);
  });

  it("Referral: Gives referral reward", async function () {
    await token.connect(owner).mint(user1.address, ethers.parseEther("1000"));
    await token.connect(user1).buyAWT(ethers.parseEther("100"), user2.address); // referrer user2
    expect(await token.totalRefRewards(user2.address)).to.be.greaterThan(0);
  });
});