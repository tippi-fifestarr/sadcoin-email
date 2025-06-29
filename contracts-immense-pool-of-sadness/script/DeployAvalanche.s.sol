// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/SADCoin.sol";
import "../src/FEELS.sol";
import "../src/StakingContract.sol";
import "../src/GameRewards.sol";
import "../src/ConversionContract.sol";
import "../src/NFTClaim.sol";

/// @notice Deployment script for Avalanche mainnet with VRF v2.5
contract DeployAvalancheScript is Script {
    // Avalanche mainnet VRF v2.5 addresses
    address constant AVALANCHE_VRF_COORDINATOR = 0xE40895D055bccd2053dD0638C9695E326152b1A4;
    address constant AVALANCHE_AVAX_USD_FEED = 0x0A77230d17318075983913bC2145DB16C7366156;
    address constant AVALANCHE_LINK_TOKEN = 0x5947BB275c521040051D82396192181b413227A3;
    
    // Key hashes for different gas prices (using 500 gwei for balanced performance)
    bytes32 constant AVALANCHE_KEY_HASH_500_GWEI = 0x84213dcadf1f89e4097eb654e3f284d7d5d5bda2bd4748d8b7fada5b3a6eaa0d;
    
    // Chainlink Functions (update with actual Avalanche addresses when available)
    address constant FUNCTIONS_ROUTER = address(0x0); // Update with actual Avalanche Functions Router
    bytes32 constant DON_ID = keccak256("fun_avalanche_mainnet_1");
    
    // VRF Subscription ID (update with your actual subscription)
    uint256 constant VRF_SUBSCRIPTION_ID = 1; // Update with actual subscription ID
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying SadCoin ecosystem to Avalanche mainnet...");
        console.log("Deployer:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        require(block.chainid == 43114, "This script is for Avalanche mainnet only");
        require(deployer.balance >= 1 ether, "Insufficient AVAX for deployment");
        
        console.log("AVALANCHE MAINNET DEPLOYMENT - PROCEED WITH CAUTION");
        console.log("Waiting 10 seconds for confirmation...");
        vm.sleep(10000);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Step 1: Deploy the token contracts first
        console.log("\\n=== Deploying Token Contracts ===");
        
        SADCoin sadCoin = new SADCoin();
        console.log("SADCoin deployed at:", address(sadCoin));
        
        FEELS feels = new FEELS();
        console.log("FEELS deployed at:", address(feels));
        
        // Step 2: Deploy the staking contract
        console.log("\\n=== Deploying Staking Contract ===");
        
        StakingContract staking = new StakingContract(
            address(sadCoin),
            address(feels)
        );
        console.log("StakingContract deployed at:", address(staking));
        
        // Step 3: Deploy the game rewards contract
        console.log("\\n=== Deploying Game Rewards Contract ===");
        
        GameRewards gameRewards = new GameRewards(
            AVALANCHE_VRF_COORDINATOR,
            address(feels),
            AVALANCHE_KEY_HASH_500_GWEI,
            VRF_SUBSCRIPTION_ID
        );
        console.log("GameRewards deployed at:", address(gameRewards));
        
        // Step 4: Deploy the conversion contract
        console.log("\\n=== Deploying Conversion Contract ===");
        
        ConversionContract conversion = new ConversionContract(
            address(sadCoin),
            address(feels),
            AVALANCHE_AVAX_USD_FEED,
            AVALANCHE_VRF_COORDINATOR,
            AVALANCHE_KEY_HASH_500_GWEI,
            VRF_SUBSCRIPTION_ID
        );
        console.log("ConversionContract deployed at:", address(conversion));
        
        // Step 5: Deploy the NFT claim contract (if Functions router is available)
        console.log("\\n=== Deploying NFT Claim Contract ===");
        
        if (FUNCTIONS_ROUTER != address(0)) {
            NFTClaim nftClaim = new NFTClaim(
                FUNCTIONS_ROUTER,
                DON_ID
            );
            console.log("NFTClaim deployed at:", address(nftClaim));
        } else {
            console.log("Functions router not available, skipping NFTClaim deployment");
        }
        
        // Step 6: Set up permissions and roles
        console.log("\\n=== Setting Up Permissions ===");
        
        // Grant FEELS minting rights to contracts
        feels.grantRole(feels.MINTER_ROLE(), address(staking));
        feels.grantRole(feels.MINTER_ROLE(), address(gameRewards));
        console.log("Granted FEELS minter role to StakingContract and GameRewards");
        
        feels.grantRole(feels.BURNER_ROLE(), address(conversion));
        console.log("Granted FEELS burner role to ConversionContract");
        
        // Grant SADCoin minting rights to conversion contract
        sadCoin.addSadMinter(address(conversion));
        console.log("Added ConversionContract as SADCoin minter");
        
        // Step 7: Initial configuration (minimal for mainnet)
        console.log("\\n=== Initial Configuration ===");
        console.log("Mainnet deployment - no test tokens minted");
        
        vm.stopBroadcast();
        
        // Step 8: Log deployment summary
        console.log("\\n=== AVALANCHE DEPLOYMENT SUMMARY ===");
        console.log("Network: Avalanche Mainnet (Chain ID: 43114)");
        console.log("Deployer:", deployer);
        console.log("SADCoin:", address(sadCoin));
        console.log("FEELS:", address(feels));
        console.log("StakingContract:", address(staking));
        console.log("GameRewards:", address(gameRewards));
        console.log("ConversionContract:", address(conversion));
        
        console.log("\\n=== CHAINLINK VRF v2.5 CONFIGURATION ===");
        console.log("VRF Coordinator:", AVALANCHE_VRF_COORDINATOR);
        console.log("Key Hash (500 gwei):", vm.toString(AVALANCHE_KEY_HASH_500_GWEI));
        console.log("Subscription ID:", VRF_SUBSCRIPTION_ID);
        console.log("LINK Token:", AVALANCHE_LINK_TOKEN);
        console.log("AVAX/USD Feed:", AVALANCHE_AVAX_USD_FEED);
        
        console.log("\\n=== PRICE FEED CONFIGURATION ===");
        console.log("Using AVAX/USD price feed for conversions");
        console.log("1 SADCoin = $0.01 USD (paid in AVAX)");
        
        console.log("\\n=== NEXT STEPS ===");
        console.log("1. Create VRF v2.5 subscription at:");
        console.log("   https://vrf.chain.link/avalanche");
        console.log("2. Add these contracts as consumers:");
        console.log("   - GameRewards:", address(gameRewards));
        console.log("   - ConversionContract:", address(conversion));
        console.log("3. Fund subscription with LINK tokens");
        console.log("4. Set up Chainlink Automation for:");
        console.log("   - StakingContract (reward distribution)");
        console.log("   - ConversionContract (daily rate updates)");
        console.log("5. Configure Chainlink Functions when available");
        console.log("6. Verify contracts on Snowtrace");
        console.log("7. Test with small amounts first");
        console.log("8. Set up monitoring and alerts");
        
        console.log("\\n AVALANCHE MAINNET DEPLOYMENT COMPLETE!");
        console.log("Time to spread sadness across the Avalanche!");
    }
}