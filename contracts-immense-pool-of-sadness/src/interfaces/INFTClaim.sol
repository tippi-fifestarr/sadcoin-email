// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Interface for the sad NFT claim contract
interface INFTClaim {
    enum SadAchievement {
        FIRST_EMAIL,
        PROCRASTINATION_MASTER,
        EMOTIONAL_DAMAGE,
        CORPORATE_DRONE,
        WEEKEND_WARRIOR,
        MIDNIGHT_OIL,
        REPLY_ALL_DISASTER,
        AUTOCORRECT_VICTIM,
        MEETING_SCHEDULER,
        OUT_OF_OFFICE_MASTER
    }
    
    struct NFTMetadata {
        SadAchievement achievement;
        uint256 timestamp;
        string emailHash;
        uint256 sadnessLevel;
        bool verified;
    }
    
    event ClaimRequested(address indexed claimer, bytes32 requestId, SadAchievement achievement);
    event NFTClaimed(address indexed claimer, uint256 tokenId, SadAchievement achievement);
    event VerificationFailed(address indexed claimer, bytes32 requestId, string reason);
    
    function requestClaim(
        SadAchievement achievement,
        string memory emailHash,
        string memory verificationData
    ) external;
    
    function getAchievementInfo(SadAchievement achievement) external view returns (
        string memory name,
        string memory description,
        uint256 sadnessLevel
    );
    
    function hasAchievement(address user, SadAchievement achievement) external view returns (bool);
    function getTokenMetadata(uint256 tokenId) external view returns (NFTMetadata memory);
    function getUserTotalSadness(address user) external view returns (uint256);
}