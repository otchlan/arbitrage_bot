import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${process.env.PROJECT_ID_M}`);
  const walletMnemonic = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
  const wallet = walletMnemonic.connect(provider);

  // Load the ABI for the ArbitrageBot contract
  const contractABI = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'smart_contracts', 'build', 'contracts', 'ArbitrageBot.json'), 'utf8')).abi;
  const contractAddress = "0xe91351324Ef1381D07320810b10836E0ecdCAcB0"; // Replace with actual contract address

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  // Define the parameters for the sellMATIC function
  const maticAmount = ethers.utils.parseEther("0.01"); // 0.01 MATIC
  const amountOutMinimum = ethers.utils.parseUnits("1", "mwei"); // Minimum amount of USDC to receive, adjust accordingly

  try {
    // Execute the sellMATIC function
    const tx = await contract.sellMATIC(maticAmount, amountOutMinimum);
    console.log("Transaction sent. Hash:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed. Block number:", receipt.blockNumber);
  } catch (error) {
    console.error("Error:", error);
  }
};

main().catch((error) => {
  console.error("Error in main execution:", error);
});
