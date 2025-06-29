// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "./SADCoin.sol";
import "./FEELS.sol";

/// @notice Staking contract where sadness generates feelings
/// @dev Stakes SADCoin to earn FEELS, with Chainlink Automation for reward distribution
contract StakingContract is ReentrancyGuard, Ownable, AutomationCompatibleInterface {
    SADCoin public immutable sadCoin;
    FEELS public immutable feels;
    
    // Staking parameters (intentionally sad numbers)
    uint256 public constant REWARD_RATE = 42; // 42 FEELS per hour per staked SAD (the answer to everything sad)
    uint256 public constant MINIMUM_STAKE = 69 * 10**18; // 69 SAD minimum (nice but sad)
    uint256 public constant UNSTAKE_DELAY = 420 minutes; // 7 hours delay (420 minutes is sad)
    
    struct StakeInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastRewardTime;
        uint256 unstakeRequestTime;
        bool unstakeRequested;
    }
    
    mapping(address => StakeInfo) public stakes;
    address[] public stakers;
    
    uint256 public totalStaked;
    uint256 public lastUpkeepTime;
    uint256 public rewardPool;
    
    event SadnessStaked(address indexed staker, uint256 amount);
    event FeelingsHarvested(address indexed staker, uint256 amount);
    event UnstakeRequested(address indexed staker, uint256 amount);
    event SadnessUnstaked(address indexed staker, uint256 amount);
    event AutomationPerformed(uint256 timestamp, uint256 stakersRewarded);
    event EmergencySadnessRescue(address indexed rescuer, uint256 amount);
    
    modifier hasStake() {
        require(stakes[msg.sender].amount > 0, "StakingContract: No sadness staked");
        _;
    }
    
    constructor(address _sadCoin, address _feels) Ownable(msg.sender) {
        require(_sadCoin != address(0), "StakingContract: SAD cannot be nothing");
        require(_feels != address(0), "StakingContract: FEELS cannot be nothing");
        
        sadCoin = SADCoin(_sadCoin);
        feels = FEELS(_feels);
        lastUpkeepTime = block.timestamp;
    }
    
    /// @notice Stake SADCoin to start earning FEELS
    function stakeSadness(uint256 amount) external nonReentrant {
        require(amount >= MINIMUM_STAKE, "StakingContract: Not sad enough to stake");
        require(sadCoin.transferFrom(msg.sender, address(this), amount), "StakingContract: Sadness transfer failed");
        
        StakeInfo storage stake = stakes[msg.sender];
        
        // Harvest pending rewards before updating stake
        if (stake.amount > 0) {
            _harvestRewards(msg.sender);
        } else {
            // New staker
            stakers.push(msg.sender);
        }
        
        stake.amount += amount;
        stake.lastRewardTime = block.timestamp;
        totalStaked += amount;
        
        emit SadnessStaked(msg.sender, amount);
    }
    
    /// @notice Request to unstake (requires waiting period for maximum sadness)
    function requestUnstake() external hasStake {
        StakeInfo storage stake = stakes[msg.sender];
        require(!stake.unstakeRequested, "StakingContract: Already requested unstake");
        
        stake.unstakeRequested = true;
        stake.unstakeRequestTime = block.timestamp;
        
        emit UnstakeRequested(msg.sender, stake.amount);
    }
    
    /// @notice Unstake after waiting period (the sadness of waiting)
    function unstakeSadness() external hasStake nonReentrant {
        StakeInfo storage stake = stakes[msg.sender];
        require(stake.unstakeRequested, "StakingContract: Must request unstake first");
        require(
            block.timestamp >= stake.unstakeRequestTime + UNSTAKE_DELAY,
            "StakingContract: Must wait in sadness before unstaking"
        );
        
        // Harvest final rewards
        _harvestRewards(msg.sender);
        
        uint256 stakedAmount = stake.amount;
        totalStaked -= stakedAmount;
        
        // Reset stake info
        stake.amount = 0;
        stake.rewardDebt = 0;
        stake.lastRewardTime = 0;
        stake.unstakeRequested = false;
        stake.unstakeRequestTime = 0;
        
        // Remove from stakers array
        _removeStaker(msg.sender);
        
        require(sadCoin.transfer(msg.sender, stakedAmount), "StakingContract: Sadness return failed");
        
        emit SadnessUnstaked(msg.sender, stakedAmount);
    }
    
    /// @notice Harvest FEELS rewards
    function harvestFeelings() external hasStake nonReentrant {
        _harvestRewards(msg.sender);
    }
    
    /// @notice Calculate pending rewards for a staker
    function pendingRewards(address staker) external view returns (uint256) {
        StakeInfo memory stake = stakes[staker];
        if (stake.amount == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - stake.lastRewardTime;
        return (stake.amount * REWARD_RATE * timeElapsed) / (1 hours * 10**18);
    }
    
    /// @notice Internal harvest function
    function _harvestRewards(address staker) internal {
        StakeInfo storage stake = stakes[staker];
        if (stake.amount == 0) return;
        
        uint256 timeElapsed = block.timestamp - stake.lastRewardTime;
        uint256 rewards = (stake.amount * REWARD_RATE * timeElapsed) / (1 hours * 10**18);
        
        if (rewards > 0) {
            stake.lastRewardTime = block.timestamp;
            feels.generateFeelings(staker, rewards, "Sad staking rewards");
            emit FeelingsHarvested(staker, rewards);
        }
    }
    
    /// @notice Remove staker from array
    function _removeStaker(address staker) internal {
        for (uint256 i = 0; i < stakers.length; i++) {
            if (stakers[i] == staker) {
                stakers[i] = stakers[stakers.length - 1];
                stakers.pop();
                break;
            }
        }
    }
    
    // Chainlink Automation functions
    
    /// @notice Check if upkeep is needed (sad automation)
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = (block.timestamp - lastUpkeepTime) >= 1 hours && stakers.length > 0;
        return (upkeepNeeded, "");
    }
    
    /// @notice Perform upkeep (distribute rewards automatically)
    function performUpkeep(bytes calldata) external override {
        require((block.timestamp - lastUpkeepTime) >= 1 hours, "StakingContract: Too early for upkeep");
        require(stakers.length > 0, "StakingContract: No stakers to reward");
        
        uint256 rewardedCount = 0;
        
        // Process up to 50 stakers per upkeep to avoid gas limits
        uint256 maxProcess = stakers.length > 50 ? 50 : stakers.length;
        
        for (uint256 i = 0; i < maxProcess; i++) {
            address staker = stakers[i];
            if (stakes[staker].amount > 0) {
                _harvestRewards(staker);
                rewardedCount++;
            }
        }
        
        lastUpkeepTime = block.timestamp;
        emit AutomationPerformed(block.timestamp, rewardedCount);
    }
    
    /// @notice Get staker count
    function getStakerCount() external view returns (uint256) {
        return stakers.length;
    }
    
    /// @notice Get staker by index
    function getStaker(uint256 index) external view returns (address) {
        require(index < stakers.length, "StakingContract: Index out of bounds");
        return stakers[index];
    }
    
    /// @notice Emergency function to rescue staked tokens if needed
    function emergencyRescue() external onlyOwner {
        uint256 balance = sadCoin.balanceOf(address(this));
        if (balance > 0) {
            sadCoin.transfer(owner(), balance);
            emit EmergencySadnessRescue(owner(), balance);
        }
    }
}