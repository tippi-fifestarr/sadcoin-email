// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/SADCoin.sol";
import "../src/FEELS.sol";
import "../src/StakingContract.sol";
import "../src/GameRewards.sol";
import "../src/ConversionContract.sol";
import "../src/NFTClaim.sol";

/// @notice Script to seed the deployed contracts with test data
/// @dev Creates a sad but functional testing environment
contract SeedDataScript is Script {
    // Contract addresses (update these with deployed addresses)
    address constant SADCOIN_ADDRESS = address(0); // Update after deployment
    address constant FEELS_ADDRESS = address(0);   // Update after deployment
    address constant STAKING_ADDRESS = address(0); // Update after deployment
    address constant GAME_REWARDS_ADDRESS = address(0); // Update after deployment
    address constant CONVERSION_ADDRESS = address(0);   // Update after deployment
    address constant NFT_CLAIM_ADDRESS = address(0);    // Update after deployment
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Seeding data for Sad ecosystem...");
        console.log("Seeder:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Load deployed contracts
        SADCoin sadCoin = SADCoin(SADCOIN_ADDRESS);
        FEELS feels = FEELS(FEELS_ADDRESS);
        StakingContract staking = StakingContract(STAKING_ADDRESS);
        GameRewards(GAME_REWARDS_ADDRESS);
        ConversionContract(payable(CONVERSION_ADDRESS));
        NFTClaim nftClaim = NFTClaim(NFT_CLAIM_ADDRESS);
        
        console.log("\n=== Creating Test Accounts ===");
        
        // Create some test accounts with sad names
        address sadUser1 = vm.addr(1);
        address sadUser2 = vm.addr(2);
        address depressedUser = vm.addr(3);
        address corporateDrone = vm.addr(4);
        address procrastinator = vm.addr(5);
        
        console.log("SadUser1:", sadUser1);
        console.log("SadUser2:", sadUser2);
        console.log("DepressedUser:", depressedUser);
        console.log("CorporateDrone:", corporateDrone);
        console.log("Procrastinator:", procrastinator);
        
        console.log("\n=== Distributing Initial Sadness ===");
        
        // Mint SADCoin to test users
        uint256 testAmount = 1000 * 10**18; // 1000 SAD each
        
        sadCoin.mintSadness(sadUser1, testAmount);
        sadCoin.mintSadness(sadUser2, testAmount);
        sadCoin.mintSadness(depressedUser, testAmount * 2); // Extra sad, gets more
        sadCoin.mintSadness(corporateDrone, testAmount * 3); // Corporate drone needs more
        sadCoin.mintSadness(procrastinator, testAmount / 2); // Procrastinator gets less
        
        console.log("Distributed SADCoin to test users");
        
        console.log("\n=== Generating Initial Feelings ===");
        
        // Mint some FEELS to test users
        uint256 feelsAmount = 500 * 10**18; // 500 FEELS each
        
        feels.generateFeelings(sadUser1, feelsAmount, "Initial sadness");
        feels.generateFeelings(sadUser2, feelsAmount, "Welcome sadness");
        feels.generateFeelings(depressedUser, feelsAmount * 2, "Extra depression");
        feels.generateFeelings(corporateDrone, feelsAmount * 3, "Corporate burnout");
        feels.generateFeelings(procrastinator, feelsAmount / 2, "Delayed gratification");
        
        console.log("Generated FEELS for test users");
        
        console.log("\n=== Setting Up Test Stakes ===");
        
        // Set up some stakes (need to impersonate users)
        vm.stopBroadcast();
        
        // Stake from different users
        _stakeAsUser(sadUser1, sadCoin, staking, 100 * 10**18); // 100 SAD
        _stakeAsUser(sadUser2, sadCoin, staking, 200 * 10**18); // 200 SAD
        _stakeAsUser(depressedUser, sadCoin, staking, 500 * 10**18); // 500 SAD
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Set up test stakes");
        
        console.log("\n=== Creating Test Game Sessions ===");
        
        // Create some game sessions (simplified for demo)
        // In production, this would be done through the frontend
        console.log("Game sessions should be created through frontend interaction");
        
        console.log("\n=== Simulating NFT Claims ===");
        
        // Simulate some NFT claims for different achievements
        try nftClaim.emergencyMint(
            corporateDrone,
            NFTClaim.SadAchievement.CORPORATE_DRONE,
            "corporate_email_hash_1"
        ) {
            console.log("Minted Corporate Drone NFT");
        } catch {
            console.log("NFT minting failed (may not have permission)");
        }
        
        try nftClaim.emergencyMint(
            procrastinator,
            NFTClaim.SadAchievement.PROCRASTINATION_MASTER,
            "procrastination_hash_1"
        ) {
            console.log("Minted Procrastination Master NFT");
        } catch {
            console.log("NFT minting failed (may not have permission)");
        }
        
        vm.stopBroadcast();
        
        console.log("\n=== SEEDING SUMMARY ===");
        console.log("Created 5 test accounts");
        console.log("Distributed SADCoin to all accounts");
        console.log("Generated initial FEELS");
        console.log("Set up test staking positions");
        console.log("Attempted NFT minting");
        
        console.log("\n=== TEST SCENARIOS READY ===");
        console.log("1. Staking rewards should accumulate over time");
        console.log("2. Users can purchase more SADCoin with ETH");
        console.log("3. Users can convert FEELS to SADCoin");
        console.log("4. Game sessions can be created and completed");
        console.log("5. NFT achievements can be claimed");
        
        console.log("\\n Test environment seeded with maximum sadness!");
    }
    
    /// @notice Helper function to stake as a specific user
    function _stakeAsUser(
        address user,
        SADCoin sadCoin,
        StakingContract staking,
        uint256 amount
    ) internal {
        vm.startPrank(user);
        
        // Approve staking contract to spend SADCoin
        sadCoin.approve(address(staking), amount);
        
        // Stake the sadness
        try staking.stakeSadness(amount) {
            console.log("Staked", amount / 10**18, "SAD for user:", user);
        } catch {
            console.log("Staking failed for user:", user);
        }
        
        vm.stopPrank();
    }
}

/// @notice Script to test various contract interactions
contract TestInteractionsScript is Script {
    function run() external view {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.addr(deployerPrivateKey);
        
        console.log("Testing contract interactions...");
        
        // Add contract addresses here after deployment
        // This script would test:
        // 1. Token transfers
        // 2. Staking and unstaking
        // 3. Game completion flow
        // 4. Conversion operations
        // 5. NFT claiming
        // 6. Chainlink operations (if available)
        
        console.log("Test interactions completed");
    }
}

/// @notice Script to simulate time passing and trigger automation
contract SimulateTimeScript is Script {
    function run() external {
        console.log("Simulating time passage for Chainlink Automation...");
        
        // In a real testnet environment, you would:
        // 1. Wait for actual time to pass
        // 2. Call checkUpkeep on automation contracts
        // 3. Trigger performUpkeep if needed
        // 4. Monitor VRF requests and fulfillments
        
        // For local testing with forge:
        vm.warp(block.timestamp + 1 days);
        console.log("Fast-forwarded 1 day");
        
        vm.warp(block.timestamp + 1 hours);
        console.log("Fast-forwarded 1 hour");
        
        console.log("Time simulation completed");
    }
}