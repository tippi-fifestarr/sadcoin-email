// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Interface for the sad staking contract
interface IStaking {
    struct StakeInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastRewardTime;
        uint256 unstakeRequestTime;
        bool unstakeRequested;
    }
    
    event SadnessStaked(address indexed staker, uint256 amount);
    event FeelingsHarvested(address indexed staker, uint256 amount);
    event UnstakeRequested(address indexed staker, uint256 amount);
    event SadnessUnstaked(address indexed staker, uint256 amount);
    
    function stakeSadness(uint256 amount) external;
    function requestUnstake() external;
    function unstakeSadness() external;
    function harvestFeelings() external;
    function pendingRewards(address staker) external view returns (uint256);
    function getStakerCount() external view returns (uint256);
    function getStaker(uint256 index) external view returns (address);
}