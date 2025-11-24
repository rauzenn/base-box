const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting BaseBoxNFT deployment to Base Mainnet...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contract with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  if (balance < hre.ethers.parseEther("0.001")) {
    console.error("❌ Insufficient balance! Need at least 0.001 ETH for deployment.");
    process.exit(1);
  }

  // Deploy contract
  console.log("⏳ Deploying BaseBoxNFT contract...");
  const BaseBoxNFT = await hre.ethers.getContractFactory("BaseBoxNFT");
  const contract = await BaseBoxNFT.deploy();

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("\n✅ BaseBoxNFT deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 BaseScan:", `https://basescan.org/address/${contractAddress}`);
  console.log("🎨 OpenSea:", `https://opensea.io/assets/base/${contractAddress}`);

  // Verify contract info
  console.log("\n📊 Contract Information:");
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalSupply = await contract.totalSupply();
  const mintingEnabled = await contract.mintingEnabled();

  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Total Supply:", totalSupply.toString());
  console.log("   Minting Enabled:", mintingEnabled);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    name: name,
    symbol: symbol,
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const fs = require("fs");
  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n✅ Deployment info saved to deployment-info.json");

  // Instructions
  console.log("\n" + "=".repeat(60));
  console.log("🎯 NEXT STEPS:");
  console.log("=".repeat(60));
  console.log("\n1️⃣  Add to Vercel Environment Variables:");
  console.log(`   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`   NEXT_PUBLIC_CHAIN_ID=8453`);
  
  console.log("\n2️⃣  Verify on BaseScan (optional):");
  console.log(`   npx hardhat verify --network base ${contractAddress}`);
  
  console.log("\n3️⃣  Test minting:");
  console.log(`   - Go to: https://basebox.vercel.app/reveals`);
  console.log(`   - Connect Farcaster wallet`);
  console.log(`   - Click "Mint as NFT"`);
  
  console.log("\n4️⃣  View on OpenSea:");
  console.log(`   https://opensea.io/assets/base/${contractAddress}`);
  
  console.log("\n" + "=".repeat(60));
  console.log("✨ Deployment Complete! ✨");
  console.log("=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });