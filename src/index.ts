// src/index.ts

import { monitorAndManagePeg } from './uniswap';
import { botData } from './dataStore'; // Import the shared data structure

async function main() {
  console.log('Starting Arbitrage Bot...');
  await monitorAndManagePeg();
}

main().catch(error => {
  console.error('Error in main execution:', error);
  botData.lastError = error.message; // Update the shared data structure on error
});
