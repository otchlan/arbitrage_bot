// uniswap.ts

import { ethers } from 'ethers';
import { Pool, Tick } from '@uniswap/v3-sdk';
import { Token, Fraction, Price, CurrencyAmount } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import UniswapV3PoolABI from '../abis/UniswapV3PoolABI.json';
import { botData } from './dataStore';


// Initialize Ethereum Provider
const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/...'); // ... put here correct PRC provider key
console.log('Ethereum provider initialized');

// Token Constants
const USDC = new Token(137, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin');
const EURO3 = new Token(137, '0xA0e4c84693266a9d3BBef2f394B33712c76599Ab', 18, 'EURO3', 'EURO3 Token');
console.log('Tokens initialized: USDC and EURO3');

// Uniswap Pool Address
const poolAddress = '0xE1f9709D32Db8A79Ae44F66299e1a93cA84DEbE3';
console.log(`Uniswap Pool Address: ${poolAddress}`);


// Initialize Pool Contract
const poolContract = new ethers.Contract(poolAddress, UniswapV3PoolABI, provider);
console.log('Uniswap pool contract initialized');


async function getPoolData() {
    console.log('Fetching pool data...');
    const [liquidity, slot] = await Promise.all([
        poolContract.liquidity(),
        poolContract.slot0(),
    ]);

    console.log('Pool data fetched successfully');

    // Constructing the pool using the fetched data
    const pool = new Pool(
        USDC,
        EURO3,
        3000, // Fee tier
        slot.sqrtPriceX96.toString(),
        liquidity.toString(),
        slot.tick
    );


    return pool;
}

async function calculateCurrentPrice() {
    console.log('Calculating current price...');
    try {
        const pool = await getPoolData();
        const price = pool.token0Price;
        const formattedPrice = price.toFixed(6);
        console.log(`Current EURO3 Price: ${formattedPrice}`);

        // Update the shared data structure with the new price
        botData.lastPrice = formattedPrice;
        
        return price;
    } catch (error) {
        console.error("Error in calculating price: ", error);
        botData.lastError = error.message; // Update on error
        throw error;
    }
}

async function monitorAndManagePeg() {
    console.log('Starting to monitor and manage peg...');
    const threshold = new Fraction(JSBI.BigInt(1), JSBI.BigInt(100)); // 1%
    const pegPrice = new Fraction(JSBI.BigInt(1), JSBI.BigInt(1)); // Assuming 1 EUR is the peg for 1 EURO3

    while (true) {
        try {
            const priceNumber = await calculateCurrentPrice();
            const price = new Fraction(JSBI.BigInt(Math.round(priceNumber.toSignificant(6) * 1000000)), JSBI.BigInt(1000000));

            if (price.lessThan(pegPrice.subtract(pegPrice.multiply(threshold)))) {
                        console.log('EURO3 is under-peg. Buying EURO3...');
                        botData.lastAction = 'Buying EURO3';
                        // Implement your buying logic here
                    } else if (price.greaterThan(pegPrice.add(pegPrice.multiply(threshold)))) {
                        console.log('EURO3 is over-peg. Selling EURO3...');
                        botData.lastAction = 'Selling EURO3';
                        // Implement your selling logic here
                    }
                } catch (error) {
                    console.error("Error in monitoring: ", error);
                    botData.lastError = error.message;
                }
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second pause
    }
}

export { calculateCurrentPrice, monitorAndManagePeg };
