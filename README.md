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




TODO:
- [ ] dokończyć server.ts żeby ogarnąć dashbord




