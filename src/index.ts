// src/index.ts

import { monitorAndManagePeg } from './uniswap';
import { checkAndTradeTest } from './tradeLogic'; // Import the trading function
import { botData } from './dataStore'; // Import the shared data structure

async function main() {
  console.log('index.ts - Starting Arbitrage Bot...');

  // Start monitoring and managing peg
  monitorAndManagePeg();

  // Start the trading logic
  setInterval(checkAndTradeTest, 20000); // Run every 60 seconds
}

main().catch(error => {
  console.error('Error in main execution:', error);
  botData.lastError = error.message; // Update the shared data structure on error
});
