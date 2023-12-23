# arbitrage_bot

# To install dependencies:
```bash
bun install
```

# To run bot:
```bash 
bun run src/index.ts
```
This code works now only as monitoring, and fake buying selling

# Dashbord - not workng
```bash
bun run src/server.ts
```
# Smart contract - buy_sell.sol
~~~
truffle compile --all
truffle migrate --network polygon_mainnet
~~~

# Communication with smart contract
File:
**src/sellMatic.ts** - build mainly for testing, standalone script focused on selling MATIC (a cryptocurrency) for another currency (like USDC). 

**src/uniswap.ts** - file is designed to interact with Uniswap. 

**src/tradeLogic.ts** - module designed for interacting with a smart contract for arbitrage opportunities in trading 


# Assignment - Arbitrage bot

requirements: nodejs/typescript/bun

The bot:
constantly looks at USDC/EURO3 prices (https://polygonscan.com/address/0xe1f9709d32db8a79ae44f66299e1a93ca84debe3) by querying the pool directly or via uniswap v3 sdk
buys EURO3 with USDC if EURO3 is under-peg (the price of 1 EURO3 <  1 EUR) under a certain threshold (for example, 0.5%, 1% etc)
sells EURO3 inventory for USDC if EURO3 is overpeg over a certain threshold

buy/sell logic and inventory can reside in a smart contract or completely done by interacting with the RPC provider

- [ ] co to? https://app.1inch.io/#/137/simple/swap/USDC_1/EURO3


TODO:
- [ ] dokończyć server.ts żeby ogarnąć dashbord




