const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fundraiser Contract", function () {
  let fundraiser;
  let donor;

  beforeEach(async function () {
    const Fundraiser = await ethers.getContractFactory("Fundraiser");
    fundraiser = await Fundraiser.deploy();
    [donor] = await ethers.getSigners();
  });

  it("Deployment should assign total funds to zero", async function () {
    expect(await fundraiser.totalDonations()).to.equal(0);
  });

  it("Donation should update balances and totalFunds", async function () {
    const donationAmount = ethers.parseEther("1.0");

    await fundraiser.connect(donor).donate({ value: donationAmount });

    // Verify that the total donations and donor balance are updated correctly
    expect(await fundraiser.totalDonations()).to.equal(donationAmount);
    expect(await fundraiser.getDonationBalance(donor.address)).to.equal(donationAmount);
  });
});
