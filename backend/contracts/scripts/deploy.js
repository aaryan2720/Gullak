const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of GullakLedger contract...");

  const GullakLedger = await hre.ethers.getContractFactory("GullakLedger");
  const ledger = await GullakLedger.deploy();

  await ledger.waitForDeployment();

  const contractAddress = await ledger.getAddress();
  console.log("------------------------------------------------");
  console.log("GullakLedger deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("------------------------------------------------");
  console.log("Copy this address and update your GULLAK_LEDGER_ADDRESS inside backend/api/.env");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
