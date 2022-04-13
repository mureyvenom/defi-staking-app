/* eslint-disable no-undef */
// const { artifacts } = require("truffle");

const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  const convertToTokens = (number) => {
    return web3.utils.toWei(number, "ether");
  };

  before(async () => {
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    //transfer reward tokens to decentral bank -- 1 million
    await rwd.transfer(decentralBank.address, convertToTokens("1000000"));

    //transfer 100 tether tokens to investor
    await tether.transfer(customer, convertToTokens("100"), { from: owner });
  });

  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Tether Token");
    });
  });

  describe("RWD Token Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });
    it("Contract has tokens", async () => {
      const balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, convertToTokens("1000000"));
    });
  });

  describe("Field Farming", async () => {
    it("Rewards tokens for staking", async () => {
      let result;
      result = await tether.balanceOf(customer);
      assert.equal(result.toString(), convertToTokens("100"));
      await tether.approve(decentralBank.address, convertToTokens("100"), {
        from: owner, //change to customer
      });
      await decentralBank.depositTokens(
        convertToTokens("100", { from: customer }) //change to customer
      );

      assert.equal((await decentralBank.isStaking(owner)).toString(), "true");

      await decentralBank.issueTokens({ from: owner });
      await decentralBank.issueTokens({ from: customer }).should.be.rejected;
    });
  });
});
