const ArbitrageBot = artifacts.require("ArbitrageBot");
const IERC20 = artifacts.require("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20");

contract("ArbitrageBot", accounts => {
  const [owner, otherAccount] = accounts;
  let arbitrageBot;
  let usdcToken;
  let maticToken;
  const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const MATIC = "0x0000000000000000000000000000000000001010";

  before(async () => {
    arbitrageBot = await ArbitrageBot.deployed();
    usdcToken = await IERC20.at(USDC);
    maticToken = await IERC20.at(MATIC);
  });

  it("should buy MATIC with USDC", async () => {
    const usdcAmount = web3.utils.toWei("10", "ether"); // 10 USDC for example
    const amountOutMinimum = 0; // This is a simplification for testing

    // Ensure owner has enough USDC and approve transfer to ArbitrageBot
    await usdcToken.approve(arbitrageBot.address, usdcAmount, { from: owner });
    await arbitrageBot.buyMATIC(usdcAmount, amountOutMinimum, { from: owner });

    // Check results, e.g., MATIC balance of contract or owner
    // assert.equal(...)
  });

  it("should sell MATIC for USDC", async () => {
    const maticAmount = web3.utils.toWei("1", "ether"); // 1 MATIC for example
    const amountOutMinimum = 0; // This is a simplification for testing

    // Ensure owner has enough MATIC and approve transfer to ArbitrageBot
    await maticToken.approve(arbitrageBot.address, maticAmount, { from: owner });
    await arbitrageBot.sellMATIC(maticAmount, amountOutMinimum, { from: owner });

    // Check results, e.g., USDC balance of contract or owner
    // assert.equal(...)
  });

  it("should withdraw tokens", async () => {
    const amount = web3.utils.toWei("1", "ether"); // 1 token for example

    // Try withdrawing USDC
    await arbitrageBot.withdrawToken(USDC, amount, { from: owner });

    // Check results, e.g., USDC balance of owner
    // assert.equal(...)
  });

  // Add more tests as needed
});
