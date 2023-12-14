require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { MNEMONIC, PROJECT_ID_M } = process.env;

module.exports = {
  networks: {
    // ... other network configurations ...

    polygon_mainnet: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC
          },
          //providerOrUrl: `https://polygon-mainnet.infura.io/v3/${PROJECT_ID}`,
          providerOrUrl: `https://polygon-mumbai.infura.io/v3/${PROJECT_ID_M}`,
          numberOfAddresses: 1,
          shareNonce: true,
        }),
      //network_id: 137,
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21", // Fetch exact version from solc-bin (default: truffle's version)
      // settings for optimizer, evmVersion, etc.
    }
  },

  // Truffle DB configuration (if needed)
  db: {
    // DB settings
  }
};
