const ArbitrageBot = artifacts.require("ArbitrageBot");

module.exports = function (deployer) {
  deployer.deploy(ArbitrageBot);
};
