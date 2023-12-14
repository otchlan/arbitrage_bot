// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArbitrageBot {
    ISwapRouter public constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    address private owner;

    address public constant USDC = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address public constant MATIC = 0x0000000000000000000000000000000000001010; // Replace with actual MATIC token address
    uint24 public constant poolFee = 3000;

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

    function buyMATIC(uint256 usdcAmount, uint256 amountOutMinimum) external onlyOwner {
        // Transfer USDC from sender to contract
        TransferHelper.safeTransferFrom(USDC, msg.sender, address(this), usdcAmount);
        // Approve Uniswap router to spend USDC
        TransferHelper.safeApprove(USDC, address(swapRouter), usdcAmount);

        // Prepare swap parameters
        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: USDC,
                tokenOut: MATIC,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp + 15 minutes,
                amountIn: usdcAmount,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        // Attempt swap
        try swapRouter.exactInputSingle(params) {
            emit OperationSuccessful("Buy MATIC successful");
        } catch {
            emit OperationFailed("Buy MATIC failed");
        }
    }

    function sellMATIC(uint256 maticAmount, uint256 amountOutMinimum) external onlyOwner {
        // Transfer MATIC from sender to contract
        TransferHelper.safeTransferFrom(MATIC, msg.sender, address(this), maticAmount);
        // Approve Uniswap router to spend MATIC
        TransferHelper.safeApprove(MATIC, address(swapRouter), maticAmount);

        // Prepare swap parameters
        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: MATIC,
                tokenOut: USDC,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp + 15 minutes,
                amountIn: maticAmount,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        // Attempt swap
        try swapRouter.exactInputSingle(params) {
            emit OperationSuccessful("Sell MATIC successful");
        } catch {
            emit OperationFailed("Sell MATIC failed");
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
