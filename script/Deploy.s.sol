// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/SADCoin.sol";
import "../src/FEELS.sol";
import "../src/StakingContract.sol";
import "../src/GameRewards.sol";
import "../src/ConversionContract.sol";
import "../src/NFTClaim.sol";

/// @notice Deployment script for the entire Sad ecosystem
/// @dev Deploys all contracts in the correct order with proper sad configuration
contract DeployScript is Script {
    // Network-specific addresses (to be updated per network)
    // Sepolia testnet addresses
    address constant SEPOLIA_VRF_COORDINATOR = 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;
    address constant SEPOLIA_ETH_USD_FEED = 0x694AA1769357215DE4FAC081bf1f309aDC325306;
    bytes32 constant SEPOLIA_KEY_HASH = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    
    // Chainlink Functions (mock addresses for demo)
    address constant FUNCTIONS_ROUTER = address(0x1234567890123456789012345678901234567890);
    bytes32 constant DON_ID = keccak256("fun_ethereum_sepolia_1234567890123456");
    
    // Deployment parameters
    uint64 constant VRF_SUBSCRIPTION_ID = 1; // Update with actual subscription
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying SadCoin ecosystem...");
        console.log("Deployer:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Step 1: Deploy the token contracts first
        console.log("\n=== Deploying Token Contracts ===");
        
        SADCoin sadCoin = new SADCoin();
        console.log("SADCoin deployed at:", address(sadCoin));
        
        FEELS feels = new FEELS();
        console.log("FEELS deployed at:", address(feels));
        
        // Step 2: Deploy the staking contract
        console.log("\n=== Deploying Staking Contract ===");
        
        StakingContract staking = new StakingContract(
            address(sadCoin),
            address(feels)
        );
        console.log("StakingContract deployed at:", address(staking));
        
        // Step 3: Deploy the game rewards contract
        console.log("\n=== Deploying Game Rewards Contract ===");
        
        GameRewards gameRewards = new GameRewards(
            SEPOLIA_VRF_COORDINATOR,
            address(feels),
            SEPOLIA_KEY_HASH,
            VRF_SUBSCRIPTION_ID
        );
        console.log("GameRewards deployed at:", address(gameRewards));
        
        // Step 4: Deploy the conversion contract
        console.log("\n=== Deploying Conversion Contract ===");
        
        ConversionContract conversion = new ConversionContract(
            address(sadCoin),
            address(feels),
            SEPOLIA_ETH_USD_FEED,
            SEPOLIA_VRF_COORDINATOR,
            SEPOLIA_KEY_HASH,
            VRF_SUBSCRIPTION_ID
        );
        console.log("ConversionContract deployed at:", address(conversion));
        
        // Step 5: Deploy the NFT claim contract
        console.log("\n=== Deploying NFT Claim Contract ===");
        
        NFTClaim nftClaim = new NFTClaim(
            FUNCTIONS_ROUTER,
            DON_ID
        );
        console.log("NFTClaim deployed at:", address(nftClaim));
        
        // Step 6: Set up permissions and roles
        console.log("\n=== Setting Up Permissions ===");
        
        // Grant FEELS minting rights to contracts
        feels.grantRole(feels.MINTER_ROLE(), address(staking));
        feels.grantRole(feels.MINTER_ROLE(), address(gameRewards));
        console.log("Granted FEELS minter role to StakingContract and GameRewards");
        
        feels.grantRole(feels.BURNER_ROLE(), address(conversion));
        console.log("Granted FEELS burner role to ConversionContract");
        
        // Grant SADCoin minting rights to conversion contract
        sadCoin.addSadMinter(address(conversion));
        console.log("Added ConversionContract as SADCoin minter");
        
        // Step 7: Initial configuration
        console.log("\n=== Initial Configuration ===");
        
        // Mint some initial SADCoin to deployer for testing
        uint256 initialMint = 10000 * 10**18; // 10,000 SAD
        sadCoin.mintSadness(deployer, initialMint);
        console.log("Minted", initialMint / 10**18, "SAD to deployer for testing");
        
        vm.stopBroadcast();
        
        // Step 8: Log deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network: Sepolia Testnet");
        console.log("Deployer:", deployer);
        console.log("SADCoin:", address(sadCoin));
        console.log("FEELS:", address(feels));
        console.log("StakingContract:", address(staking));
        console.log("GameRewards:", address(gameRewards));
        console.log("ConversionContract:", address(conversion));
        console.log("NFTClaim:", address(nftClaim));
        
        console.log("\n=== CHAINLINK CONFIGURATION NEEDED ===");
        console.log("1. Add these contracts as VRF consumers:");
        console.log("   - GameRewards:", address(gameRewards));
        console.log("   - ConversionContract:", address(conversion));
        console.log("2. Fund VRF subscription ID:", VRF_SUBSCRIPTION_ID);
        console.log("3. Set up Chainlink Automation for:");
        console.log("   - StakingContract (reward distribution)");
        console.log("   - ConversionContract (daily rate updates)");
        console.log("4. Configure Chainlink Functions for NFTClaim");
        
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Verify contracts on Etherscan");
        console.log("2. Set up Chainlink services");
        console.log("3. Configure frontend with contract addresses");
        console.log("4. Test all functionality");
        console.log("5. Deploy to mainnet when ready");
        
        console.log("\\n Deployment completed! Ready to spread the sadness!");
    }
}

/// @notice Deployment script for mainnet with production settings
contract DeployMainnetScript is Script {
    // Mainnet addresses
    address constant MAINNET_VRF_COORDINATOR = 0x271682DEB8C4E0901D1a1550aD2e64D568E69909;
    address constant MAINNET_ETH_USD_FEED = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
    bytes32 constant MAINNET_KEY_HASH = 0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef;
    
    // Production configuration
    uint64 constant VRF_SUBSCRIPTION_ID = 1; // Update with actual subscription
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        require(block.chainid == 1, "This script is for Ethereum mainnet only");
        require(deployer.balance >= 0.5 ether, "Insufficient ETH for deployment");
        
        console.log("MAINNET DEPLOYMENT - PROCEED WITH CAUTION");
        console.log("Deployer:", deployer);
        console.log("Balance:", deployer.balance);
        
        // Add confirmation step for mainnet
        console.log("Waiting 10 seconds for confirmation...");
        vm.sleep(10000);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy with production parameters
        SADCoin sadCoin = new SADCoin();
        FEELS feels = new FEELS();
        
        StakingContract staking = new StakingContract(
            address(sadCoin),
            address(feels)
        );
        
        GameRewards gameRewards = new GameRewards(
            MAINNET_VRF_COORDINATOR,
            address(feels),
            MAINNET_KEY_HASH,
            VRF_SUBSCRIPTION_ID
        );
        
        ConversionContract conversion = new ConversionContract(
            address(sadCoin),
            address(feels),
            MAINNET_ETH_USD_FEED,
            MAINNET_VRF_COORDINATOR,
            MAINNET_KEY_HASH,
            VRF_SUBSCRIPTION_ID
        );
        
        // Note: Update Functions router address for mainnet
        new NFTClaim(
            address(0), // Update with actual Functions router
            bytes32(0)  // Update with actual DON ID
        );
        
        // Set up permissions
        feels.grantRole(feels.MINTER_ROLE(), address(staking));
        feels.grantRole(feels.MINTER_ROLE(), address(gameRewards));
        feels.grantRole(feels.BURNER_ROLE(), address(conversion));
        sadCoin.addSadMinter(address(conversion));
        
        vm.stopBroadcast();
        
        console.log("\\n MAINNET DEPLOYMENT COMPLETE!");
        console.log("Time to spread sadness across Ethereum!");
    }
}