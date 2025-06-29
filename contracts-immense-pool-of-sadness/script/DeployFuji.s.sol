// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/SADCoin.sol";
import "../src/FEELS.sol";
import "../src/StakingContract.sol";
import "../src/GameRewards.sol";
import "../src/ConversionContract.sol";
import "../src/NFTClaim.sol";

/// @notice Deployment script for Avalanche Fuji testnet with VRF v2.5
contract DeployFujiScript is Script {
    // Avalanche Fuji testnet VRF v2.5 addresses
    address constant FUJI_VRF_COORDINATOR = 0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE;
    address constant FUJI_AVAX_USD_FEED = 0x5498BB86BC934c8D34FDA08E81D444153d05D0ED; // Fuji AVAX/USD
    address constant FUJI_LINK_TOKEN = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    bytes32 constant FUJI_KEY_HASH = 0xc799bd1e3bd4d1a41cd4968997a4e03dfd2a3c7c04b695881138580163f42887;
    
    // Chainlink Functions (update with actual Fuji addresses when available)
    address constant FUNCTIONS_ROUTER = address(0x649A2DA509887A4C4a049c16e15a3952E8E8b60D); // Fuji Functions Router
    bytes32 constant DON_ID = keccak256("fun_avalanche_fuji_1");
    
    // VRF Subscription ID (provided by user)
    uint256 constant VRF_SUBSCRIPTION_ID = 46762056020529533874057064774710682204091327534126680614438774830768663434923;
    
    function run() external {
        address deployer = msg.sender;
        
        console.log("Deploying SadCoin ecosystem to Avalanche Fuji testnet...");
        console.log("Deployer:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        require(block.chainid == 43113, "This script is for Avalanche Fuji testnet only");
        require(deployer.balance >= 0.1 ether, "Insufficient AVAX for deployment");
        
        vm.startBroadcast();
        
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
            FUJI_VRF_COORDINATOR,
            address(feels),
            FUJI_KEY_HASH,
            VRF_SUBSCRIPTION_ID
        );
        console.log("GameRewards deployed at:", address(gameRewards));
        
        // Step 4: Deploy the conversion contract
        console.log("\\n=== Deploying Conversion Contract ===");
        
        ConversionContract conversion = new ConversionContract(
            address(sadCoin),
            address(feels),
            FUJI_AVAX_USD_FEED,
            FUJI_VRF_COORDINATOR,
            FUJI_KEY_HASH,
            VRF_SUBSCRIPTION_ID
        );
        console.log("ConversionContract deployed at:", address(conversion));
        
        // Step 5: Deploy the NFT claim contract
        console.log("\\n=== Deploying NFT Claim Contract ===");
        
        NFTClaim nftClaim = new NFTClaim(
            FUNCTIONS_ROUTER,
            DON_ID
        );
        console.log("NFTClaim deployed at:", address(nftClaim));
        
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
        
        // Step 7: Initial configuration
        console.log("\\n=== Initial Configuration ===");
        
        // Mint some initial SADCoin to deployer for testing
        uint256 initialMint = 10000 * 10**18; // 10,000 SAD
        sadCoin.mintSadness(deployer, initialMint);
        console.log("Minted", initialMint / 10**18, "SAD to deployer for testing");
        
        vm.stopBroadcast();
        
        // Step 8: Log deployment summary
        console.log("\\n=== AVALANCHE FUJI DEPLOYMENT SUMMARY ===");
        console.log("Network: Avalanche Fuji Testnet (Chain ID: 43113)");
        console.log("Deployer:", deployer);
        console.log("SADCoin:", address(sadCoin));
        console.log("FEELS:", address(feels));
        console.log("StakingContract:", address(staking));
        console.log("GameRewards:", address(gameRewards));
        console.log("ConversionContract:", address(conversion));
        console.log("NFTClaim:", address(nftClaim));
        
        console.log("\\n=== CHAINLINK VRF v2.5 CONFIGURATION ===");
        console.log("VRF Coordinator:", FUJI_VRF_COORDINATOR);
        console.log("Key Hash (300 gwei):", vm.toString(FUJI_KEY_HASH));
        console.log("Subscription ID:", VRF_SUBSCRIPTION_ID);
        console.log("LINK Token:", FUJI_LINK_TOKEN);
        console.log("AVAX/USD Feed:", FUJI_AVAX_USD_FEED);
        
        console.log("\\n=== VRF PARAMETERS ===");
        console.log("Premium (AVAX): 60%");
        console.log("Premium (LINK): 50%");
        console.log("Max Gas Limit: 2,500,000");
        console.log("Min Confirmations: 1");
        console.log("Max Confirmations: 200");
        console.log("Max Random Values: 500");
        
        console.log("\\n=== NEXT STEPS ===");
        console.log("1. VRF subscription already created with ID:", VRF_SUBSCRIPTION_ID);
        console.log("2. Add these contracts as consumers:");
        console.log("   - GameRewards:", address(gameRewards));
        console.log("   - ConversionContract:", address(conversion));
        console.log("3. Fund subscription with LINK tokens from:");
        console.log("   https://faucets.chain.link/fuji");
        console.log("4. Set up Chainlink Automation for:");
        console.log("   - StakingContract (reward distribution)");
        console.log("   - ConversionContract (daily rate updates)");
        console.log("5. Configure Chainlink Functions for NFTClaim");
        console.log("6. Verify contracts on Snowtrace");
        console.log("7. Test all functionality");
        
        console.log("\\n Fuji deployment completed! Ready for sad testing on Avalanche!");
    }
}