// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Interface for the sad game rewards contract
interface IGameRewards {
    struct GameSession {
        address player;
        uint256 score;
        uint256 timestamp;
        bool rewarded;
        uint256 vrfRequestId;
    }
    
    event GameSessionStarted(address indexed player, uint256 sessionId);
    event GameCompleted(address indexed player, uint256 sessionId, uint256 score);
    event RandomnessRequested(uint256 indexed requestId, address indexed player);
    event SadRewardCalculated(address indexed player, uint256 baseReward, uint256 multiplier, uint256 finalReward);
    
    function startGameSession() external returns (uint256);
    function completeGame(uint256 sessionId, uint256 score) external;
    function getPlayerSessions(address player) external view returns (uint256[] memory);
    function getSessionDetails(uint256 sessionId) external view returns (
        address player,
        uint256 score,
        uint256 timestamp,
        bool rewarded,
        uint256 vrfRequestId
    );
    function isPendingReward(uint256 requestId) external view returns (bool);
    function getStats() external view returns (
        uint256 totalGamesPlayed,
        uint256 totalFeelsDistributed,
        uint256 activeSessions
    );
}