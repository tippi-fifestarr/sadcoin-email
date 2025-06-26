// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import "./FEELS.sol";

/// @notice Game rewards contract with sad randomness
/// @dev Uses Chainlink VRF to determine how sad the rewards are
contract GameRewards is ReentrancyGuard, Ownable {
    IVRFCoordinatorV2Plus private immutable vrfCoordinator;
    FEELS public immutable feels;
    
    // VRF Configuration
    bytes32 private keyHash;
    uint256 private subscriptionId;
    uint32 private callbackGasLimit = 100000;
    uint16 private requestConfirmations = 3;
    uint32 private numWords = 1;
    
    // Game parameters (sad numbers)
    uint256 public constant BASE_REWARD = 111 * 10**18; // 111 FEELS base reward
    uint256 public constant MAX_MULTIPLIER = 420; // Maximum 4.2x multiplier (420%)
    uint256 public constant GAME_COST = 42 * 10**18; // 42 SAD to play (the answer to sad)
    
    struct GameSession {
        address player;
        uint256 score;
        uint256 timestamp;
        bool rewarded;
        uint256 vrfRequestId;
    }
    
    struct PendingReward {
        address player;
        uint256 baseReward;
        uint256 timestamp;
    }
    
    mapping(uint256 => GameSession) public gameSessions;
    mapping(address => uint256[]) public playerSessions;
    mapping(uint256 => PendingReward) public pendingRewards; // VRF request ID => reward info
    
    uint256 public sessionCounter;
    uint256 public totalGamesPlayed;
    uint256 public totalFeelsDistributed;
    
    event GameSessionStarted(address indexed player, uint256 sessionId);
    event GameCompleted(address indexed player, uint256 sessionId, uint256 score);
    event RandomnessRequested(uint256 indexed requestId, address indexed player);
    event SadRewardCalculated(address indexed player, uint256 baseReward, uint256 multiplier, uint256 finalReward);
    event EmotionalDamageInflicted(address indexed player, uint256 damage);
    
    modifier validSession(uint256 sessionId) {
        require(sessionId <= sessionCounter, "GameRewards: Invalid session");
        require(gameSessions[sessionId].player != address(0), "GameRewards: Session does not exist");
        _;
    }
    
    constructor(
        address _vrfCoordinator,
        address _feels,
        bytes32 _keyHash,
        uint256 _subscriptionId
    ) Ownable(msg.sender) {
        vrfCoordinator = IVRFCoordinatorV2Plus(_vrfCoordinator);
        feels = FEELS(_feels);
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
    }
    
    /// @notice Start a new game session (begin the sadness)
    function startGameSession() external returns (uint256) {
        sessionCounter++;
        uint256 sessionId = sessionCounter;
        
        gameSessions[sessionId] = GameSession({
            player: msg.sender,
            score: 0,
            timestamp: block.timestamp,
            rewarded: false,
            vrfRequestId: 0
        });
        
        playerSessions[msg.sender].push(sessionId);
        
        emit GameSessionStarted(msg.sender, sessionId);
        return sessionId;
    }
    
    /// @notice Complete game and submit score (the moment of truth)
    function completeGame(uint256 sessionId, uint256 score) external validSession(sessionId) nonReentrant {
        GameSession storage session = gameSessions[sessionId];
        require(session.player == msg.sender, "GameRewards: Not your sad game");
        require(session.score == 0, "GameRewards: Game already completed");
        require(score > 0, "GameRewards: Score must be positive (even if sad)");
        
        session.score = score;
        totalGamesPlayed++;
        
        // Calculate base reward based on score (sadder scores get more)
        uint256 baseReward = _calculateBaseReward(score);
        
        // Request randomness for multiplier
        uint256 requestId = vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        
        session.vrfRequestId = requestId;
        pendingRewards[requestId] = PendingReward({
            player: msg.sender,
            baseReward: baseReward,
            timestamp: block.timestamp
        });
        
        emit GameCompleted(msg.sender, sessionId, score);
        emit RandomnessRequested(requestId, msg.sender);
    }
    
    /// @notice Calculate base reward based on score (sadder is better)
    function _calculateBaseReward(uint256 score) internal pure returns (uint256) {
        // Inverse relationship: lower scores (sadder performance) get more rewards
        if (score <= 10) return BASE_REWARD + (500 * 10**18); // Very sad performance = big bonus
        if (score <= 50) return BASE_REWARD + (200 * 10**18); // Sad performance = medium bonus
        if (score <= 100) return BASE_REWARD + (50 * 10**18);  // Slightly sad = small bonus
        return BASE_REWARD; // Good performance = just base reward (how sad)
    }
    
    /// @notice Chainlink VRF callback to determine final reward multiplier
    function rawFulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) external {
        require(msg.sender == address(vrfCoordinator), "GameRewards: Only VRF coordinator can fulfill");
        fulfillRandomWords(requestId, randomWords);
    }
    
    /// @notice Internal function to handle VRF response
    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal {
        PendingReward memory reward = pendingRewards[requestId];
        require(reward.player != address(0), "GameRewards: Invalid reward request");
        
        // Calculate sad multiplier based on random number
        uint256 randomValue = randomWords[0] % 1000; // 0-999
        uint256 multiplier = _calculateSadMultiplier(randomValue);
        
        uint256 finalReward = (reward.baseReward * multiplier) / 100;
        
        // Mint FEELS to player
        feels.generateFeelings(reward.player, finalReward, "Sad game completion");
        totalFeelsDistributed += finalReward;
        
        // Clean up pending reward
        delete pendingRewards[requestId];
        
        emit SadRewardCalculated(reward.player, reward.baseReward, multiplier, finalReward);
        
        // Sometimes inflict emotional damage for the sadness
        if (randomValue < 100) { // 10% chance
            uint256 damage = finalReward / 10; // 10% of reward as damage
            if (feels.balanceOf(reward.player) >= damage) {
                feels.destroyFeelings(reward.player, damage, "Random emotional damage from gaming");
                emit EmotionalDamageInflicted(reward.player, damage);
            }
        }
    }
    
    /// @notice Calculate multiplier based on randomness (biased towards sadness)
    function _calculateSadMultiplier(uint256 randomValue) internal pure returns (uint256) {
        // Weighted towards lower multipliers for maximum sadness
        if (randomValue < 400) return 50;   // 40% chance for 0.5x (very sad)
        if (randomValue < 700) return 75;   // 30% chance for 0.75x (sad)
        if (randomValue < 850) return 100;  // 15% chance for 1x (normal)
        if (randomValue < 950) return 150;  // 10% chance for 1.5x (lucky)
        if (randomValue < 990) return 200;  // 4% chance for 2x (very lucky)
        return MAX_MULTIPLIER;              // 1% chance for 4.2x (miracle, but still sad number)
    }
    
    /// @notice Get player's game sessions
    function getPlayerSessions(address player) external view returns (uint256[] memory) {
        return playerSessions[player];
    }
    
    /// @notice Get session details
    function getSessionDetails(uint256 sessionId) external view returns (
        address player,
        uint256 score,
        uint256 timestamp,
        bool rewarded,
        uint256 vrfRequestId
    ) {
        GameSession memory session = gameSessions[sessionId];
        return (session.player, session.score, session.timestamp, session.rewarded, session.vrfRequestId);
    }
    
    /// @notice Check if reward is pending VRF fulfillment
    function isPendingReward(uint256 requestId) external view returns (bool) {
        return pendingRewards[requestId].player != address(0);
    }
    
    /// @notice Emergency function to manually fulfill stuck rewards
    function emergencyFulfillReward(uint256 requestId, uint256 mockRandomness) external onlyOwner {
        PendingReward memory reward = pendingRewards[requestId];
        require(reward.player != address(0), "GameRewards: No pending reward");
        require(block.timestamp > reward.timestamp + 1 days, "GameRewards: Must wait 24 hours");
        
        uint256 multiplier = _calculateSadMultiplier(mockRandomness % 1000);
        uint256 finalReward = (reward.baseReward * multiplier) / 100;
        
        feels.generateFeelings(reward.player, finalReward, "Emergency manual reward");
        totalFeelsDistributed += finalReward;
        
        delete pendingRewards[requestId];
        
        emit SadRewardCalculated(reward.player, reward.baseReward, multiplier, finalReward);
    }
    
    /// @notice Update VRF configuration
    function updateVRFConfig(
        bytes32 _keyHash,
        uint256 _subscriptionId,
        uint32 _callbackGasLimit
    ) external onlyOwner {
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
        callbackGasLimit = _callbackGasLimit;
    }
    
    /// @notice Get contract statistics
    function getStats() external view returns (
        uint256 _totalGamesPlayed,
        uint256 _totalFeelsDistributed,
        uint256 _activeSessions
    ) {
        return (totalGamesPlayed, totalFeelsDistributed, sessionCounter);
    }
}