// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Constants for the sad ecosystem
library Constants {
    // Sad numbers that define our universe
    uint256 public constant THE_ANSWER = 42; // The answer to life, universe, and sadness
    uint256 public constant NICE_BUT_SAD = 69; // Nice but also sad
    uint256 public constant VERY_SAD = 111; // Three ones for maximum sadness
    uint256 public constant ULTIMATE_SAD = 420; // The ultimate sad number
    
    // Time constants (in seconds) - all intentionally sad
    uint256 public constant ONE_SAD_HOUR = 3600; // 1 hour
    uint256 public constant PROCRASTINATION_TIME = 86400; // 24 hours
    uint256 public constant WEEKEND_SADNESS = 172800; // 48 hours (weekend)
    uint256 public constant WORK_WEEK_SUFFERING = 432000; // 5 days
    
    // Percentages (basis points) for sad calculations
    uint256 public constant BASIS_POINTS = 10000; // 100%
    uint256 public constant SADNESS_TAX = 420; // 4.2% sadness tax
    uint256 public constant EMOTIONAL_DAMAGE_RATE = 1111; // 11.11% emotional damage
    uint256 public constant DEPRESSION_MULTIPLIER = 150; // 1.5x depression bonus
    
    // Email-related constants
    uint256 public constant MAX_EMAIL_LENGTH = 10000; // Max characters in sad email
    uint256 public constant REPLY_ALL_DISASTER_THRESHOLD = 50; // 50+ recipients = disaster
    uint256 public constant PROCRASTINATION_THRESHOLD = 24; // 24 hours delay = procrastination
    
    // Token supply constants
    uint256 public constant SADCOIN_DECIMALS = 18;
    uint256 public constant FEELS_DECIMALS = 18;
    uint256 public constant MILLION = 1_000_000;
    uint256 public constant BILLION = 1_000_000_000;
    
    // Conversion rates (the five numbers of sadness)
    uint256 public constant CONVERSION_RATE_1 = 11;   // Least sad
    uint256 public constant CONVERSION_RATE_2 = 42;   // Moderately sad
    uint256 public constant CONVERSION_RATE_3 = 69;   // Quite sad
    uint256 public constant CONVERSION_RATE_4 = 111;  // Very sad
    uint256 public constant CONVERSION_RATE_5 = 420;  // Ultimate sadness
    
    // Gas limits for Chainlink operations
    uint32 public constant VRF_GAS_LIMIT = 100000;
    uint32 public constant FUNCTIONS_GAS_LIMIT = 300000;
    uint32 public constant AUTOMATION_GAS_LIMIT = 500000;
    
    // Sadness level thresholds
    uint256 public constant MILD_SADNESS = 1;
    uint256 public constant MODERATE_SADNESS = 3;
    uint256 public constant SIGNIFICANT_SADNESS = 5;
    uint256 public constant SEVERE_SADNESS = 7;
    uint256 public constant EXTREME_SADNESS = 9;
    uint256 public constant ULTIMATE_SADNESS = 10;
    
    // Price constants (in wei)
    uint256 public constant SADCOIN_PRICE_WEI = 10**16; // $0.01 in wei (assuming $1000 ETH)
    uint256 public constant ETH_USD_DECIMALS = 8; // Chainlink price feed decimals
    
    // Game scoring constants
    uint256 public constant PERFECT_SCORE = 100;
    uint256 public constant MEDIOCRE_SCORE = 50;
    uint256 public constant TERRIBLE_SCORE = 10;
    uint256 public constant ROCK_BOTTOM_SCORE = 1;
    
    // NFT constants
    uint256 public constant MAX_NFT_SUPPLY = 10000;
    uint256 public constant ACHIEVEMENT_COUNT = 10;
    
    // Staking constants
    uint256 public constant MIN_STAKE_AMOUNT = NICE_BUT_SAD * 10**SADCOIN_DECIMALS; // 69 SAD minimum
    uint256 public constant REWARD_MULTIPLIER = THE_ANSWER; // 42 FEELS per hour per SAD
    uint256 public constant UNSTAKE_DELAY = 7 hours; // 7 hours of sadness before unstaking
    
    // Daily limits to prevent too much happiness
    uint256 public constant MAX_DAILY_PURCHASES = 1000 * 10**SADCOIN_DECIMALS; // 1000 SAD per day
    uint256 public constant MAX_DAILY_CONVERSIONS = 1000 * 10**SADCOIN_DECIMALS; // 1000 SAD per day
    uint256 public constant PURCHASE_COOLDOWN = 1 hours; // 1 hour between purchases
}