async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  try {
    const Fundraiser = await ethers.getContractFactory("Fundraiser");
    const fundraiser = await Fundraiser.deploy();

    await fundraiser.waitForDeployment();


    console.log("Fundraiser contract deployed to:", fundraiser.target);
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
