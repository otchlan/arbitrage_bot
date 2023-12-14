// src/tradeLogic.ts
import { ethers } from 'ethers';
import ArbitrageBotArtifact from '../smart_contracts/build/contracts/ArbitrageBot.json'; // Import the artifact
import dotenv from 'dotenv';
import { calculateCurrentPrice } from './uniswap'; // Import the price calculation function

dotenv.config();

// Configuration
const providerUrl = process.env.PROJECT_ID 
  ? `https://polygon-mainnet.infura.io/v3/${process.env.PROJECT_ID}`
  : "default_provider_url"; // Fallback URL if PROJECT_ID is not set
const botContractAddress = "0xA8347f8D4D005aCFea4094Ca50A466D77d1D105b"; // Replace with your deployed contract address
const mnemonic = process.env.MNEMONIC; // Load mnemonic

const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic);
const wallet = walletMnemonic.connect(provider);

const ArbitrageBotABI = ArbitrageBotArtifact.abi; // Extract ABI
const arbitrageBot = new ethers.Contract(botContractAddress, ArbitrageBotABI, wallet);

async function estimateGasPrice() {
    const gasPrice = await provider.getGasPrice();
    console.log("tradeLogic.ts - Estimated Gas Price:", ethers.utils.formatUnits(gasPrice, 'gwei'), "Gwei");
    return gasPrice;
}

export async function checkAndTrade() {
    const currentPrice = await calculateCurrentPrice();
    const pegPrice = 1; // Define the peg price
    const threshold = 0.01; // Define the threshold (e.g., 1%)

    if (currentPrice < (pegPrice * (1 - threshold))) {
        console.log('tradeLogic.ts - EURO3 is under-peg. Buying EURO3...');
        const buyTx = await arbitrageBot.buyEURO3({ gasPrice: await estimateGasPrice() });
        console.log("tradeLogic.ts - Buy transaction sent:", buyTx.hash);
    } else if (currentPrice > (pegPrice * (1 + threshold))) {
        console.log('tradeLogic.ts - EURO3 is over-peg. Selling EURO3...');
        const sellTx = await arbitrageBot.sellEURO3({ gasPrice: await estimateGasPrice() });
        console.log("tradeLogic.ts - Sell transaction sent:", sellTx.hash);
    }
}

export async function checkAndTradeTest() {
    const currentPrice = await calculateCurrentPrice();
    const pegPrice = 1; // Define the peg price
    const threshold = 0.01; // Define the threshold (e.g., 1%)
    const minimalTradeAmount = "0.01"; // Set a minimal trade amount

    if (currentPrice < (pegPrice * (1 - threshold))) {
        console.log('tradeLogic.ts - EURO3 is under-peg. Buying EURO3 with minimal amount...');
        const buyTx = await arbitrageBot.buyEURO3(minimalTradeAmount, { gasPrice: await estimateGasPrice() });
        console.log("tradeLogic.ts - Buy transaction sent:", buyTx.hash);
    } else if (currentPrice > (pegPrice * (1 + threshold))) {
        console.log('tradeLogic.ts - EURO3 is over-peg. Selling EURO3 with minimal amount...');
        const sellTx = await arbitrageBot.sellEURO3(minimalTradeAmount, { gasPrice: await estimateGasPrice() });
        console.log("tradeLogic.ts - Sell transaction sent:", sellTx.hash);
    }
}

//setInterval(checkAndTrade, 60000); // Run every 60 seconds
