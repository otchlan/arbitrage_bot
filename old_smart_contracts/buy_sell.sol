// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IUniswapV3 {
    function swapExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        address recipient,
        uint256 deadline,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountOut);

    function swapExactOutputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        address recipient,
        uint256 deadline,
        uint256 amountOut,
        uint256 amountInMaximum,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountIn);
}

contract ArbitrageBot {
    using SafeERC20 for IERC20;

    address private owner;
    IUniswapV3 public uniswap;

    address private constant USDC_ADDRESS = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address private constant EURO3_ADDRESS = 0xA0e4c84693266a9d3BBef2f394B33712c76599Ab; // MAINNET EURO3
    //address private constant EURO3_ADDRESS = 0xf2F1e896487Aec812557f34A5c99201F2a730233; // test EURO3

    constructor(address _uniswap) {
        owner = msg.sender;
        uniswap = IUniswapV3(_uniswap);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Function to buy EURO3 with USDC
    function buyEURO3(uint256 usdcAmount, uint256 amountOutMinimum) external onlyOwner {
        IERC20 usdc = IERC20(USDC_ADDRESS);

        // Check and approve if needed
        if (usdc.allowance(address(this), address(uniswap)) < usdcAmount) {
            usdc.approve(address(uniswap), usdcAmount);
        }
        uint256 deadline = block.timestamp + 15 * 60;
        uniswap.swapExactInputSingle(
            USDC_ADDRESS,
            EURO3_ADDRESS,
            3000,
            address(this),
            deadline,
            usdcAmount,
            amountOutMinimum,
            0
        );
    }

    // Function to sell EURO3 for USDC
    function sellEURO3(uint256 euro3Amount, uint256 amountInMaximum) external onlyOwner {
        IERC20 euro3 = IERC20(EURO3_ADDRESS);

        // Check allowance and approve if needed
        if (euro3.allowance(address(this), address(uniswap)) < euro3Amount) {
            euro3.approve(address(uniswap), euro3Amount);
        }

        // Perform the swap
        uint256 deadline = block.timestamp + 15 * 60;
        uniswap.swapExactOutputSingle(
            EURO3_ADDRESS,
            USDC_ADDRESS,
            3000,
            address(this),
            deadline,
            euro3Amount,
            amountInMaximum,
            0
        );
    }

    function withdrawToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(msg.sender, amount);
    }
}
