#!/bin/bash

# Creating directories
echo "Creating project structure within arbitrage_bot..."
mkdir -p src abis

# Creating TypeScript files
touch src/uniswap.ts
touch src/tradeLogic.ts
touch src/config.ts
touch src/index.ts

# Creating ABI JSON file
touch abis/UniswapV3PoolABI.json

# Creating package.json, tsconfig.json, and README.md
touch package.json
touch tsconfig.json
touch README.md

echo "Project structure created successfully!"
