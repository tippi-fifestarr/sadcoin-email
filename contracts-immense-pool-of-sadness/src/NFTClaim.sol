// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/// @notice NFT contract for claiming sad achievements based on email interactions
/// @dev Uses Chainlink Functions to verify off-chain email events
contract NFTClaim is ERC721, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;
    
    // Chainlink Functions (simplified interface for demonstration)
    // In production, you'd use the actual Chainlink Functions contract
    address public functionsRouter;
    bytes32 public donId;
    
    uint256 public nextTokenId = 1;
    uint256 public constant MAX_SUPPLY = 10000; // Maximum sad NFTs
    
    // Sad achievement types
    enum SadAchievement {
        FIRST_EMAIL,           // Sent first email
        PROCRASTINATION_MASTER,// Took over 24h to reply
        EMOTIONAL_DAMAGE,      // Received a harsh email
        CORPORATE_DRONE,       // Sent 100+ emails
        WEEKEND_WARRIOR,       // Sent email on weekend
        MIDNIGHT_OIL,          // Sent email after midnight
        REPLY_ALL_DISASTER,    // Used reply-all incorrectly
        AUTOCORRECT_VICTIM,    // Autocorrect failure
        MEETING_SCHEDULER,     // Scheduled 50+ meetings
        OUT_OF_OFFICE_MASTER   // Perfect OOO message
    }
    
    struct NFTMetadata {
        SadAchievement achievement;
        uint256 timestamp;
        string emailHash; // Hash of email for verification
        uint256 sadnessLevel; // How sad this achievement is (1-10)
        bool verified;
    }
    
    mapping(uint256 => NFTMetadata) public tokenMetadata;
    mapping(string => bool) public usedEmailHashes; // Prevent duplicate claims
    mapping(address => mapping(SadAchievement => bool)) public userAchievements;
    mapping(bytes32 => address) public pendingClaims; // Functions request ID => claimer
    
    // Achievement names and descriptions
    mapping(SadAchievement => string) public achievementNames;
    mapping(SadAchievement => string) public achievementDescriptions;
    mapping(SadAchievement => uint256) public achievementSadness;
    
    event ClaimRequested(address indexed claimer, bytes32 requestId, SadAchievement achievement);
    event NFTClaimed(address indexed claimer, uint256 tokenId, SadAchievement achievement);
    event VerificationFailed(address indexed claimer, bytes32 requestId, string reason);
    event SadnessLevelUpdated(uint256 tokenId, uint256 newSadnessLevel);
    
    modifier validAchievement(SadAchievement achievement) {
        require(uint256(achievement) <= uint256(SadAchievement.OUT_OF_OFFICE_MASTER), "NFTClaim: Invalid achievement");
        _;
    }
    
    constructor(address _functionsRouter, bytes32 _donId) 
        ERC721("Sad Email Achievements", "SEMAIL") 
        Ownable(msg.sender) 
    {
        functionsRouter = _functionsRouter;
        donId = _donId;
        
        // Initialize achievement data
        _initializeAchievements();
    }
    
    /// @notice Initialize all achievement metadata
    function _initializeAchievements() internal {
        achievementNames[SadAchievement.FIRST_EMAIL] = "First Email Sent";
        achievementDescriptions[SadAchievement.FIRST_EMAIL] = "Sent your first sad email in the corporate world";
        achievementSadness[SadAchievement.FIRST_EMAIL] = 3;
        
        achievementNames[SadAchievement.PROCRASTINATION_MASTER] = "Procrastination Master";
        achievementDescriptions[SadAchievement.PROCRASTINATION_MASTER] = "Took over 24 hours to reply - the ultimate sadness";
        achievementSadness[SadAchievement.PROCRASTINATION_MASTER] = 8;
        
        achievementNames[SadAchievement.EMOTIONAL_DAMAGE] = "Emotional Damage Taken";
        achievementDescriptions[SadAchievement.EMOTIONAL_DAMAGE] = "Received an email that hurt your feelings";
        achievementSadness[SadAchievement.EMOTIONAL_DAMAGE] = 9;
        
        achievementNames[SadAchievement.CORPORATE_DRONE] = "Corporate Drone";
        achievementDescriptions[SadAchievement.CORPORATE_DRONE] = "Sent over 100 emails - your soul is gone";
        achievementSadness[SadAchievement.CORPORATE_DRONE] = 10;
        
        achievementNames[SadAchievement.WEEKEND_WARRIOR] = "Weekend Warrior";
        achievementDescriptions[SadAchievement.WEEKEND_WARRIOR] = "Sent email on weekend - work-life balance is dead";
        achievementSadness[SadAchievement.WEEKEND_WARRIOR] = 7;
        
        achievementNames[SadAchievement.MIDNIGHT_OIL] = "Midnight Oil Burner";
        achievementDescriptions[SadAchievement.MIDNIGHT_OIL] = "Sent email after midnight - sleep is for the weak";
        achievementSadness[SadAchievement.MIDNIGHT_OIL] = 6;
        
        achievementNames[SadAchievement.REPLY_ALL_DISASTER] = "Reply All Disaster";
        achievementDescriptions[SadAchievement.REPLY_ALL_DISASTER] = "Used reply-all incorrectly and caused chaos";
        achievementSadness[SadAchievement.REPLY_ALL_DISASTER] = 8;
        
        achievementNames[SadAchievement.AUTOCORRECT_VICTIM] = "Autocorrect Victim";
        achievementDescriptions[SadAchievement.AUTOCORRECT_VICTIM] = "Autocorrect made you look like a fool";
        achievementSadness[SadAchievement.AUTOCORRECT_VICTIM] = 5;
        
        achievementNames[SadAchievement.MEETING_SCHEDULER] = "Meeting Scheduler";
        achievementDescriptions[SadAchievement.MEETING_SCHEDULER] = "Scheduled 50+ meetings - destroyer of calendars";
        achievementSadness[SadAchievement.MEETING_SCHEDULER] = 9;
        
        achievementNames[SadAchievement.OUT_OF_OFFICE_MASTER] = "Out of Office Master";
        achievementDescriptions[SadAchievement.OUT_OF_OFFICE_MASTER] = "Crafted the perfect OOO message - rare talent";
        achievementSadness[SadAchievement.OUT_OF_OFFICE_MASTER] = 2;
    }
    
    /// @notice Request NFT claim based on email achievement
    function requestClaim(
        SadAchievement achievement,
        string memory emailHash,
        string memory verificationData
    ) external validAchievement(achievement) nonReentrant {
        require(!userAchievements[msg.sender][achievement], "NFTClaim: Achievement already claimed");
        require(!usedEmailHashes[emailHash], "NFTClaim: Email already used for claim");
        require(nextTokenId <= MAX_SUPPLY, "NFTClaim: Max supply reached");
        
        // In a real implementation, this would call Chainlink Functions
        // For now, we'll simulate the request
        bytes32 requestId = keccak256(abi.encodePacked(
            msg.sender,
            achievement,
            emailHash,
            block.timestamp,
            verificationData
        ));
        
        pendingClaims[requestId] = msg.sender;
        
        emit ClaimRequested(msg.sender, requestId, achievement);
        
        // Simulate immediate verification for demo (in production, this would be async)
        _fulfillClaim(requestId, true, achievement, emailHash);
    }
    
    /// @notice Fulfill claim verification (would be called by Chainlink Functions)
    function _fulfillClaim(
        bytes32 requestId,
        bool verified,
        SadAchievement achievement,
        string memory emailHash
    ) internal {
        address claimer = pendingClaims[requestId];
        require(claimer != address(0), "NFTClaim: Invalid request ID");
        
        if (!verified) {
            emit VerificationFailed(claimer, requestId, "Email verification failed");
            delete pendingClaims[requestId];
            return;
        }
        
        // Mint NFT
        uint256 tokenId = nextTokenId++;
        
        tokenMetadata[tokenId] = NFTMetadata({
            achievement: achievement,
            timestamp: block.timestamp,
            emailHash: emailHash,
            sadnessLevel: achievementSadness[achievement],
            verified: true
        });
        
        userAchievements[claimer][achievement] = true;
        usedEmailHashes[emailHash] = true;
        
        _mint(claimer, tokenId);
        
        emit NFTClaimed(claimer, tokenId, achievement);
        delete pendingClaims[requestId];
    }
    
    /// @notice Get achievement info
    function getAchievementInfo(SadAchievement achievement) external view returns (
        string memory name,
        string memory description,
        uint256 sadnessLevel
    ) {
        return (
            achievementNames[achievement],
            achievementDescriptions[achievement],
            achievementSadness[achievement]
        );
    }
    
    /// @notice Check if user has claimed specific achievement
    function hasAchievement(address user, SadAchievement achievement) external view returns (bool) {
        return userAchievements[user][achievement];
    }
    
    /// @notice Get token metadata
    function getTokenMetadata(uint256 tokenId) external view returns (NFTMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "NFTClaim: Token does not exist");
        return tokenMetadata[tokenId];
    }
    
    /// @notice Generate NFT metadata JSON
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "NFTClaim: Token does not exist");
        
        NFTMetadata memory metadata = tokenMetadata[tokenId];
        
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', achievementNames[metadata.achievement], '",',
                        '"description": "', achievementDescriptions[metadata.achievement], '",',
                        '"attributes": [',
                        '{"trait_type": "Achievement", "value": "', achievementNames[metadata.achievement], '"},',
                        '{"trait_type": "Sadness Level", "value": ', metadata.sadnessLevel.toString(), '},',
                        '{"trait_type": "Timestamp", "value": ', metadata.timestamp.toString(), '},',
                        '{"trait_type": "Verified", "value": "', metadata.verified ? "true" : "false", '"}',
                        '],',
                        '"image": "', _generateSVG(metadata), '"',
                        '}'
                    )
                )
            )
        );
        
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
    
    /// @notice Generate SVG image for NFT
    function _generateSVG(NFTMetadata memory metadata) internal view returns (string memory) {
        string memory sadnessColor = _getSadnessColor(metadata.sadnessLevel);
        
        string memory svg = string(
            abi.encodePacked(
                '<svg width="350" height="350" xmlns="http://www.w3.org/2000/svg">',
                '<rect width="100%" height="100%" fill="', sadnessColor, '"/>',
                '<text x="175" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="white">',
                'Sad Email Achievement',
                '</text>',
                '<text x="175" y="150" font-family="Arial" font-size="12" text-anchor="middle" fill="white">',
                achievementNames[metadata.achievement],
                '</text>',
                '<text x="175" y="200" font-family="Arial" font-size="10" text-anchor="middle" fill="white">',
                'Sadness Level: ', metadata.sadnessLevel.toString(),
                '</text>',
                '<text x="175" y="250" font-family="Arial" font-size="8" text-anchor="middle" fill="white">',
                'Claimed: ', metadata.timestamp.toString(),
                '</text>',
                '</svg>'
            )
        );
        
        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(svg))));
    }
    
    /// @notice Get color based on sadness level
    function _getSadnessColor(uint256 sadnessLevel) internal pure returns (string memory) {
        if (sadnessLevel <= 2) return "#87CEEB"; // Light blue (mild sadness)
        if (sadnessLevel <= 4) return "#4682B4"; // Steel blue (moderate sadness)
        if (sadnessLevel <= 6) return "#2F4F4F"; // Dark slate gray (significant sadness)
        if (sadnessLevel <= 8) return "#191970"; // Midnight blue (severe sadness)
        return "#000080"; // Navy (ultimate sadness)
    }
    
    /// @notice Get user's total sadness level across all NFTs
    function getUserTotalSadness(address user) external view returns (uint256 totalSadness) {
        uint256 balance = balanceOf(user);
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            totalSadness += tokenMetadata[tokenId].sadnessLevel;
        }
        return totalSadness;
    }
    
    /// @notice Admin function to manually verify and mint (emergency use)
    function emergencyMint(
        address to,
        SadAchievement achievement,
        string memory emailHash
    ) external onlyOwner validAchievement(achievement) {
        require(!userAchievements[to][achievement], "NFTClaim: Achievement already claimed");
        require(nextTokenId <= MAX_SUPPLY, "NFTClaim: Max supply reached");
        
        uint256 tokenId = nextTokenId++;
        
        tokenMetadata[tokenId] = NFTMetadata({
            achievement: achievement,
            timestamp: block.timestamp,
            emailHash: emailHash,
            sadnessLevel: achievementSadness[achievement],
            verified: true
        });
        
        userAchievements[to][achievement] = true;
        usedEmailHashes[emailHash] = true;
        
        _mint(to, tokenId);
        
        emit NFTClaimed(to, tokenId, achievement);
    }
    
    /// @notice Update Chainlink Functions configuration
    function updateFunctionsConfig(address _functionsRouter, bytes32 _donId) external onlyOwner {
        functionsRouter = _functionsRouter;
        donId = _donId;
    }
    
    // Required overrides for ERC721Enumerable
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

// Note: In production, you would need to implement the actual Chainlink Functions integration
// This would include proper request handling, callback functions, and error handling