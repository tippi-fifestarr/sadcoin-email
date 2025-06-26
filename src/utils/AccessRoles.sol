// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Access control roles for the sad ecosystem
library AccessRoles {
    // Core administrative roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    
    // Token-specific roles
    bytes32 public constant SADCOIN_MINTER_ROLE = keccak256("SADCOIN_MINTER_ROLE");
    bytes32 public constant FEELS_MINTER_ROLE = keccak256("FEELS_MINTER_ROLE");
    bytes32 public constant FEELS_BURNER_ROLE = keccak256("FEELS_BURNER_ROLE");
    
    // Contract interaction roles
    bytes32 public constant STAKING_MANAGER_ROLE = keccak256("STAKING_MANAGER_ROLE");
    bytes32 public constant GAME_MANAGER_ROLE = keccak256("GAME_MANAGER_ROLE");
    bytes32 public constant CONVERSION_MANAGER_ROLE = keccak256("CONVERSION_MANAGER_ROLE");
    bytes32 public constant NFT_MANAGER_ROLE = keccak256("NFT_MANAGER_ROLE");
    
    // Chainlink operation roles
    bytes32 public constant VRF_MANAGER_ROLE = keccak256("VRF_MANAGER_ROLE");
    bytes32 public constant AUTOMATION_MANAGER_ROLE = keccak256("AUTOMATION_MANAGER_ROLE");
    bytes32 public constant FUNCTIONS_MANAGER_ROLE = keccak256("FUNCTIONS_MANAGER_ROLE");
    bytes32 public constant PRICE_FEED_MANAGER_ROLE = keccak256("PRICE_FEED_MANAGER_ROLE");
    
    // Emergency roles (for when things get too sad)
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 public constant RESCUE_ROLE = keccak256("RESCUE_ROLE");
    
    // Game-specific roles
    bytes32 public constant GAME_OPERATOR_ROLE = keccak256("GAME_OPERATOR_ROLE");
    bytes32 public constant SCORE_VALIDATOR_ROLE = keccak256("SCORE_VALIDATOR_ROLE");
    bytes32 public constant REWARD_DISTRIBUTOR_ROLE = keccak256("REWARD_DISTRIBUTOR_ROLE");
    
    // Email verification roles (for NFT claims)
    bytes32 public constant EMAIL_VERIFIER_ROLE = keccak256("EMAIL_VERIFIER_ROLE");
    bytes32 public constant ACHIEVEMENT_GRANTER_ROLE = keccak256("ACHIEVEMENT_GRANTER_ROLE");
    
    // Economic roles
    bytes32 public constant RATE_SETTER_ROLE = keccak256("RATE_SETTER_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");
    bytes32 public constant FEE_COLLECTOR_ROLE = keccak256("FEE_COLLECTOR_ROLE");
    
    // Sad-specific roles (because sadness needs management)
    bytes32 public constant SADNESS_DISTRIBUTOR_ROLE = keccak256("SADNESS_DISTRIBUTOR_ROLE");
    bytes32 public constant EMOTIONAL_DAMAGE_DEALER_ROLE = keccak256("EMOTIONAL_DAMAGE_DEALER_ROLE");
    bytes32 public constant DEPRESSION_MANAGER_ROLE = keccak256("DEPRESSION_MANAGER_ROLE");
    
    /// @notice Get human-readable role name
    function getRoleName(bytes32 role) internal pure returns (string memory) {
        if (role == ADMIN_ROLE) return "Admin";
        if (role == OWNER_ROLE) return "Owner";
        if (role == SADCOIN_MINTER_ROLE) return "SADCoin Minter";
        if (role == FEELS_MINTER_ROLE) return "FEELS Minter";
        if (role == FEELS_BURNER_ROLE) return "FEELS Burner";
        if (role == STAKING_MANAGER_ROLE) return "Staking Manager";
        if (role == GAME_MANAGER_ROLE) return "Game Manager";
        if (role == CONVERSION_MANAGER_ROLE) return "Conversion Manager";
        if (role == NFT_MANAGER_ROLE) return "NFT Manager";
        if (role == VRF_MANAGER_ROLE) return "VRF Manager";
        if (role == AUTOMATION_MANAGER_ROLE) return "Automation Manager";
        if (role == FUNCTIONS_MANAGER_ROLE) return "Functions Manager";
        if (role == PRICE_FEED_MANAGER_ROLE) return "Price Feed Manager";
        if (role == EMERGENCY_ROLE) return "Emergency";
        if (role == PAUSE_ROLE) return "Pause";
        if (role == RESCUE_ROLE) return "Rescue";
        if (role == GAME_OPERATOR_ROLE) return "Game Operator";
        if (role == SCORE_VALIDATOR_ROLE) return "Score Validator";
        if (role == REWARD_DISTRIBUTOR_ROLE) return "Reward Distributor";
        if (role == EMAIL_VERIFIER_ROLE) return "Email Verifier";
        if (role == ACHIEVEMENT_GRANTER_ROLE) return "Achievement Granter";
        if (role == RATE_SETTER_ROLE) return "Rate Setter";
        if (role == TREASURY_ROLE) return "Treasury";
        if (role == FEE_COLLECTOR_ROLE) return "Fee Collector";
        if (role == SADNESS_DISTRIBUTOR_ROLE) return "Sadness Distributor";
        if (role == EMOTIONAL_DAMAGE_DEALER_ROLE) return "Emotional Damage Dealer";
        if (role == DEPRESSION_MANAGER_ROLE) return "Depression Manager";
        
        return "Unknown Role";
    }
    
    /// @notice Check if a role is a core administrative role
    function isCoreRole(bytes32 role) internal pure returns (bool) {
        return role == ADMIN_ROLE || 
               role == OWNER_ROLE || 
               role == EMERGENCY_ROLE || 
               role == PAUSE_ROLE || 
               role == RESCUE_ROLE;
    }
    
    /// @notice Check if a role is a token management role
    function isTokenRole(bytes32 role) internal pure returns (bool) {
        return role == SADCOIN_MINTER_ROLE ||
               role == FEELS_MINTER_ROLE ||
               role == FEELS_BURNER_ROLE;
    }
    
    /// @notice Check if a role is a Chainlink operation role
    function isChainlinkRole(bytes32 role) internal pure returns (bool) {
        return role == VRF_MANAGER_ROLE ||
               role == AUTOMATION_MANAGER_ROLE ||
               role == FUNCTIONS_MANAGER_ROLE ||
               role == PRICE_FEED_MANAGER_ROLE;
    }
    
    /// @notice Check if a role is a game operation role
    function isGameRole(bytes32 role) internal pure returns (bool) {
        return role == GAME_MANAGER_ROLE ||
               role == GAME_OPERATOR_ROLE ||
               role == SCORE_VALIDATOR_ROLE ||
               role == REWARD_DISTRIBUTOR_ROLE;
    }
    
    /// @notice Check if a role deals with sadness (the most important roles)
    function isSadnessRole(bytes32 role) internal pure returns (bool) {
        return role == SADNESS_DISTRIBUTOR_ROLE ||
               role == EMOTIONAL_DAMAGE_DEALER_ROLE ||
               role == DEPRESSION_MANAGER_ROLE;
    }
}