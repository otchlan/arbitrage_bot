// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArbitrageBot {
    ISwapRouter public constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    address private owner;

    address public constant USDC = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address public constant EURO3 = 0xA0e4c84693266a9d3BBef2f394B33712c76599Ab;
    uint24 public constant poolFee = 3000; // Pool fee

    event OperationSuccessful(string message);
    event OperationFailed(string message);
    event Withdrawn(address token, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function buyEURO3(uint256 usdcAmount, uint256 amountOutMinimum) external onlyOwner {
        TransferHelper.safeTransferFrom(USDC, msg.sender, address(this), usdcAmount);
        TransferHelper.safeApprove(USDC, address(swapRouter), usdcAmount);

        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: USDC,
                tokenOut: EURO3,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp + 15 minutes,
                amountIn: usdcAmount,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        try swapRouter.exactInputSingle(params) {
            emit OperationSuccessful("Buy EURO3 successful");
        } catch {
            emit OperationFailed("Buy EURO3 failed");
        }
    }

    function sellEURO3(uint256 euro3Amount, uint256 amountOutMinimum) external onlyOwner {
        TransferHelper.safeTransferFrom(EURO3, msg.sender, address(this), euro3Amount);
        TransferHelper.safeApprove(EURO3, address(swapRouter), euro3Amount);

        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: EURO3,
                tokenOut: USDC,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp + 15 minutes,
                amountIn: euro3Amount,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        try swapRouter.exactInputSingle(params) {
            emit OperationSuccessful("Sell EURO3 successful");
        } catch {
            emit OperationFailed("Sell EURO3 failed");
        }
    }

    function withdrawToken(address token, uint256 amount) external onlyOwner {
        bool success = IERC20(token).transfer(msg.sender, amount);
        if (success) {
            emit Withdrawn(token, amount);
        } else {
            emit OperationFailed("Withdrawal failed");
        }
    }
}
