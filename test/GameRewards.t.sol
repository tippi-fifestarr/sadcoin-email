// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/GameRewards.sol";
import "../src/FEELS.sol";

/// @notice Mock VRF Coordinator for testing
contract MockVRFCoordinatorV2Plus {
    mapping(uint256 => address) public requestToSender;
    uint256 private currentRequestId = 1;
    
    event RandomWordsRequested(uint256 requestId, address sender);
    
    function requestRandomWords(
        VRFV2PlusClient.RandomWordsRequest calldata req
    ) external returns (uint256 requestId) {
        requestId = currentRequestId++;
        requestToSender[requestId] = msg.sender;
        emit RandomWordsRequested(requestId, msg.sender);
        return requestId;
    }
    
    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) external {
        address consumer = requestToSender[requestId];
        require(consumer != address(0), "Invalid request ID");
        
        // Call the consumer's fulfillment function
        GameRewards(consumer).rawFulfillRandomWords(requestId, randomWords);
    }
}

/// @notice Tests for GameRewards contract with VRF mocking
contract GameRewardsTest is Test {
    GameRewards public gameRewards;
    FEELS public feels;
    MockVRFCoordinatorV2Plus public mockVRF;
    
    address public owner;
    address public player1;
    address public player2;
    
    bytes32 constant KEY_HASH = keccak256("test_key_hash");
    uint256 constant SUBSCRIPTION_ID = 1;
    uint256 constant TEST_SCORE_LOW = 5;  // Very sad score
    uint256 constant TEST_SCORE_HIGH = 95; // Good score (less rewards)
    
    event GameSessionStarted(address indexed player, uint256 sessionId);
    event GameCompleted(address indexed player, uint256 sessionId, uint256 score);
    event RandomnessRequested(uint256 indexed requestId, address indexed player);
    event SadRewardCalculated(address indexed player, uint256 baseReward, uint256 multiplier, uint256 finalReward);
    
    function setUp() public {
        owner = address(this);
        player1 = makeAddr("player1");
        player2 = makeAddr("player2");
        
        // Deploy mock VRF coordinator
        mockVRF = new MockVRFCoordinatorV2Plus();
        
        // Deploy FEELS token
        feels = new FEELS();
        
        // Deploy GameRewards
        gameRewards = new GameRewards(
            address(mockVRF),
            address(feels),
            KEY_HASH,
            SUBSCRIPTION_ID
        );
        
        // Grant minter role to GameRewards
        feels.grantRole(feels.MINTER_ROLE(), address(gameRewards));
        
        // Grant burner role to GameRewards for emotional damage
        feels.grantRole(feels.BURNER_ROLE(), address(gameRewards));
    }
    
    function testStartGameSession() public {
        vm.prank(player1);
        
        vm.expectEmit(true, false, false, true);
        emit GameSessionStarted(player1, 1);
        
        uint256 sessionId = gameRewards.startGameSession();
        
        assertEq(sessionId, 1);
        
        // Check session details
        (address player, uint256 score, uint256 timestamp, bool rewarded, uint256 vrfRequestId) = 
            gameRewards.getSessionDetails(sessionId);
        
        assertEq(player, player1);
        assertEq(score, 0);
        assertEq(timestamp, block.timestamp);
        assertFalse(rewarded);
        assertEq(vrfRequestId, 0);
    }
    
    function testCompleteGameLowScore() public {
        // Start session
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        // Complete game with low score (should get high rewards)
        vm.prank(player1);
        
        vm.expectEmit(true, false, false, true);
        emit GameCompleted(player1, sessionId, TEST_SCORE_LOW);
        
        vm.expectEmit(false, true, false, false);
        emit RandomnessRequested(1, player1);
        
        gameRewards.completeGame(sessionId, TEST_SCORE_LOW);
        
        // Check session was updated
        (, uint256 score, , , uint256 vrfRequestId) = gameRewards.getSessionDetails(sessionId);
        assertEq(score, TEST_SCORE_LOW);
        assertEq(vrfRequestId, 1);
        
        // Check pending reward exists
        assertTrue(gameRewards.isPendingReward(1));
    }
    
    function testCompleteGameHighScore() public {
        // Start session
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        // Complete game with high score (should get lower rewards)
        vm.prank(player1);
        gameRewards.completeGame(sessionId, TEST_SCORE_HIGH);
        
        // Verify score was recorded
        (, uint256 score, , , ) = gameRewards.getSessionDetails(sessionId);
        assertEq(score, TEST_SCORE_HIGH);
    }
    
    function testVRFFulfillmentLowScore() public {
        // Start and complete game
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        vm.prank(player1);
        gameRewards.completeGame(sessionId, TEST_SCORE_LOW);
        
        uint256 initialBalance = feels.balanceOf(player1);
        
        // Fulfill VRF with specific random value for testing
        // Using 600 to get a 1.5x multiplier (random % 1000 = 600, which maps to 150 in _calculateSadMultiplier)
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 600;
        
        vm.expectEmit(true, false, false, false);
        emit SadRewardCalculated(player1, 0, 0, 0); // We don't check exact values due to complexity
        
        mockVRF.fulfillRandomWords(1, randomWords);
        
        // Check that FEELS were minted
        uint256 finalBalance = feels.balanceOf(player1);
        assertGt(finalBalance, initialBalance, "FEELS should have been minted");
        
        // Check that pending reward was cleared
        assertFalse(gameRewards.isPendingReward(1));
    }
    
    function testVRFFulfillmentHighScore() public {
        // Start and complete game with high score
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        vm.prank(player1);
        gameRewards.completeGame(sessionId, TEST_SCORE_HIGH);
        
        uint256 initialBalance = feels.balanceOf(player1);
        
        // Fulfill VRF with random value that gives 0.5x multiplier (very sad)
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 200; // Should map to 50 (0.5x multiplier)
        
        mockVRF.fulfillRandomWords(1, randomWords);
        
        uint256 finalBalance = feels.balanceOf(player1);
        assertGt(finalBalance, initialBalance, "FEELS should have been minted even with penalty");
    }
    
    function testVRFFulfillmentMaxMultiplier() public {
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        vm.prank(player1);
        gameRewards.completeGame(sessionId, TEST_SCORE_LOW);
        
        uint256 initialBalance = feels.balanceOf(player1);
        
        // Use random value that gives maximum multiplier (4.2x)
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 999; // Should map to 420 (4.2x multiplier)
        
        mockVRF.fulfillRandomWords(1, randomWords);
        
        uint256 finalBalance = feels.balanceOf(player1);
        uint256 gained = finalBalance - initialBalance;
        
        // Should be significant reward due to low score + max multiplier
        assertGt(gained, 1000 * 10**18, "Should get substantial reward with max multiplier");
    }
    
    function testEmotionalDamage() public {
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        vm.prank(player1);
        gameRewards.completeGame(sessionId, TEST_SCORE_LOW);
        
        // Use random value < 100 to trigger emotional damage (10% chance)
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 50; // Should trigger emotional damage
        
        mockVRF.fulfillRandomWords(1, randomWords);
        
        // Check that emotional damage was inflicted
        uint256 damage = feels.getEmotionalDamage(player1);
        assertGt(damage, 0, "Emotional damage should have been inflicted");
    }
    
    function testCannotCompleteGameTwice() public {
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        vm.prank(player1);
        gameRewards.completeGame(sessionId, TEST_SCORE_LOW);
        
        // Try to complete again
        vm.prank(player1);
        vm.expectRevert("GameRewards: Game already completed");
        gameRewards.completeGame(sessionId, TEST_SCORE_HIGH);
    }
    
    function testCannotCompleteOthersGame() public {
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        // Player2 tries to complete player1's game
        vm.prank(player2);
        vm.expectRevert("GameRewards: Not your sad game");
        gameRewards.completeGame(sessionId, TEST_SCORE_LOW);
    }
    
    function testOnlyVRFCanFulfill() public {
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        vm.prank(player1);
        gameRewards.completeGame(sessionId, TEST_SCORE_LOW);
        
        // Try to fulfill from non-VRF address
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 500;
        
        vm.prank(player2);
        vm.expectRevert("GameRewards: Only VRF coordinator can fulfill");
        gameRewards.rawFulfillRandomWords(1, randomWords);
    }
    
    function testMultiplePlayers() public {
        // Player 1 session
        vm.prank(player1);
        uint256 session1 = gameRewards.startGameSession();
        
        // Player 2 session
        vm.prank(player2);
        uint256 session2 = gameRewards.startGameSession();
        
        assertEq(session1, 1);
        assertEq(session2, 2);
        
        // Both complete games
        vm.prank(player1);
        gameRewards.completeGame(session1, TEST_SCORE_LOW);
        
        vm.prank(player2);
        gameRewards.completeGame(session2, TEST_SCORE_HIGH);
        
        // Fulfill both
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 500;
        
        mockVRF.fulfillRandomWords(1, randomWords);
        mockVRF.fulfillRandomWords(2, randomWords);
        
        // Both should have FEELS
        assertGt(feels.balanceOf(player1), 0);
        assertGt(feels.balanceOf(player2), 0);
    }
    
    function testGetStats() public {
        // Initial stats
        (uint256 totalGames, uint256 totalFeels, uint256 activeSessions) = gameRewards.getStats();
        assertEq(totalGames, 0);
        assertEq(totalFeels, 0);
        assertEq(activeSessions, 0);
        
        // Complete a game
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        vm.prank(player1);
        gameRewards.completeGame(sessionId, TEST_SCORE_LOW);
        
        // Stats should update
        (totalGames, , activeSessions) = gameRewards.getStats();
        assertEq(totalGames, 1);
        assertEq(activeSessions, 1);
        
        // Fulfill VRF
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 500;
        mockVRF.fulfillRandomWords(1, randomWords);
        
        // Total FEELS distributed should increase
        (, totalFeels, ) = gameRewards.getStats();
        assertGt(totalFeels, 0);
    }
    
    function testUpdateVRFConfig() public {
        bytes32 newKeyHash = keccak256("new_key_hash");
        uint256 newSubId = 999;
        uint32 newGasLimit = 200000;
        
        gameRewards.updateVRFConfig(newKeyHash, newSubId, newGasLimit);
        
        // Verify config was updated by trying to start a game
        // (The actual verification would require exposing the config variables)
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        assertEq(sessionId, 1); // Should still work
    }
    
    function testOnlyOwnerCanUpdateConfig() public {
        vm.prank(player1);
        vm.expectRevert();
        gameRewards.updateVRFConfig(keccak256("test"), 999, 200000);
    }
    
    function testEmergencyFulfillReward() public {
        vm.prank(player1);
        uint256 sessionId = gameRewards.startGameSession();
        
        vm.prank(player1);
        gameRewards.completeGame(sessionId, TEST_SCORE_LOW);
        
        // Fast forward past emergency threshold
        vm.warp(block.timestamp + 2 days);
        
        // Emergency fulfill should work
        gameRewards.emergencyFulfillReward(1, 500);
        
        // Should have received FEELS
        assertGt(feels.balanceOf(player1), 0);
        assertFalse(gameRewards.isPendingReward(1));
    }
}