// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/ConversionContract.sol";
import "../src/SADCoin.sol";
import "../src/FEELS.sol";

/// @notice Mock Price Feed for testing
contract MockPriceFeed {
    int256 private price;
    uint256 private updatedAt;
    
    constructor(int256 _price) {
        price = _price;
        updatedAt = block.timestamp;
    }
    
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,  
        uint256 startedAt,
        uint256 updatedAt_,
        uint80 answeredInRound
    ) {
        return (1, price, updatedAt, updatedAt, 1);
    }
    
    function updatePrice(int256 _price) external {
        price = _price;
        updatedAt = block.timestamp;
    }
    
    function setStalePrice() external {
        updatedAt = block.timestamp - 2 hours; // Make price stale
    }
}

/// @notice Mock VRF Coordinator for ConversionContract testing
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
        
        ConversionContract(consumer).rawFulfillRandomWords(requestId, randomWords);
    }
}

/// @notice Tests for ConversionContract with comprehensive VRF and Price Feed mocking
contract ConversionContractTest is Test {
    ConversionContract public conversion;
    SADCoin public sadCoin;
    FEELS public feels;
    MockPriceFeed public priceFeed;
    MockVRFCoordinatorV2Plus public mockVRF;
    
    address public owner;
    address public user1;
    address public user2;
    
    bytes32 constant KEY_HASH = keccak256("test_key_hash");
    uint256 constant SUBSCRIPTION_ID = 1;
    int256 constant ETH_PRICE_USD = 2000 * 10**8; // $2000 ETH (8 decimals)
    
    event SadCoinPurchased(address indexed buyer, uint256 sadAmount, uint256 ethPaid, uint256 ethPrice);
    event FeelsConvertedToSad(address indexed converter, uint256 feelsAmount, uint256 sadAmount, uint256 rate);
    event ConversionRateUpdated(uint256 oldRate, uint256 newRate);
    event RandomnessRequestedForRate(uint256 requestId);
    
    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        // Deploy mock contracts
        priceFeed = new MockPriceFeed(ETH_PRICE_USD);
        mockVRF = new MockVRFCoordinatorV2Plus();
        
        // Deploy token contracts
        sadCoin = new SADCoin();
        feels = new FEELS();
        
        // Deploy conversion contract
        conversion = new ConversionContract(
            address(sadCoin),
            address(feels),
            address(priceFeed),
            address(mockVRF),
            KEY_HASH,
            SUBSCRIPTION_ID
        );
        
        // Set up permissions
        sadCoin.addSadMinter(address(conversion));
        feels.grantRole(feels.MINTER_ROLE(), address(conversion));
        feels.grantRole(feels.BURNER_ROLE(), address(conversion));
    }
    
    function testPurchaseSadness() public {
        uint256 ethAmount = 0.1 ether;
        vm.deal(user1, ethAmount);
        
        // Ensure user1 has no previous purchases (should be clean slate)
        assertEq(conversion.lastPurchaseTime(user1), 0);
        
        vm.prank(user1);
        conversion.purchaseSadness{value: ethAmount}();
        
        // Check SADCoin balance (0.1 ETH * $2000 = $200, at $0.01 per SAD = 20,000 SAD)
        uint256 expectedSAD = 20000 * 10**18;
        assertEq(sadCoin.balanceOf(user1), expectedSAD);
        
        // Check purchase tracking
        assertEq(conversion.totalSadPurchased(user1), expectedSAD);
        assertEq(conversion.lastPurchaseTime(user1), block.timestamp);
        
        // Check that event was emitted
        assertGt(sadCoin.balanceOf(user1), 0);
    }
    
    function testPurchaseCooldown() public {
        uint256 ethAmount = 0.05 ether;
        vm.deal(user1, ethAmount * 2);
        
        // First purchase
        vm.prank(user1);
        conversion.purchaseSadness{value: ethAmount}();
        
        // Try immediate second purchase
        vm.prank(user1);
        vm.expectRevert("ConversionContract: Must wait between purchases (the sadness of waiting)");
        conversion.purchaseSadness{value: ethAmount}();
        
        // Fast forward past cooldown and update price feed
        vm.warp(block.timestamp + 1 hours + 1);
        priceFeed.updatePrice(ETH_PRICE_USD);
        
        // Now should work
        vm.prank(user1);
        conversion.purchaseSadness{value: ethAmount}();
    }
    
    function testPurchaseWithStalePrice() public {
        // Set stale price
        priceFeed.setStalePrice();
        
        vm.deal(user1, 0.1 ether);
        vm.prank(user1);
        vm.expectRevert("ConversionContract: Price data too old");
        conversion.purchaseSadness{value: 0.1 ether}();
    }
    
    function testCalculatePurchaseAmount() public {
        uint256 ethAmount = 0.5 ether;
        (uint256 sadAmount, uint256 ethPriceUSD) = conversion.calculatePurchaseAmount(ethAmount);
        
        assertEq(ethPriceUSD, 2000 * 10**18); // $2000 with 18 decimals
        assertEq(sadAmount, 100000 * 10**18); // 0.5 ETH * $2000 = $1000, at $0.01 per SAD = 100,000 SAD
    }
    
    function testConvertFeelsToSad() public {
        // First give user some FEELS
        uint256 feelsAmount = 222 * 10**18; // 222 FEELS
        feels.generateFeelings(user1, feelsAmount, "Test feelings");
        
        vm.prank(user1);
        
        vm.expectEmit(true, false, false, false);
        emit FeelsConvertedToSad(user1, feelsAmount, 0, 111);
        
        conversion.convertFeelsToSad(feelsAmount);
        
        // Should get 2 SAD (222 FEELS / 111 rate = 2 SAD)
        assertEq(sadCoin.balanceOf(user1), 2 * 10**18);
        assertEq(feels.balanceOf(user1), 0); // FEELS should be burned
        assertEq(conversion.totalFeelsConverted(user1), feelsAmount);
    }
    
    function testConvertFeelsInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert("ConversionContract: Not enough feelings");
        conversion.convertFeelsToSad(100 * 10**18);
    }
    
    function testConvertFeelsDailyLimit() public {
        // Give user lots of FEELS
        uint256 largeAmount = 1500 * 10**18;
        feels.generateFeelings(user1, largeAmount, "Test feelings");
        
        vm.prank(user1);
        vm.expectRevert("ConversionContract: Daily conversion limit reached");
        conversion.convertFeelsToSad(1200 * 10**18); // Exceeds 1000 SAD limit
    }
    
    function testGetDailyConversionStatus() public {
        uint256 feelsAmount = 333 * 10**18; // Will convert to 3 SAD at rate 111
        feels.generateFeelings(user1, feelsAmount, "Test feelings");
        
        // Initial status
        (uint256 used, uint256 remaining) = conversion.getDailyConversionStatus(user1);
        assertEq(used, 0);
        assertEq(remaining, 1000 * 10**18);
        
        // Convert some
        vm.prank(user1);
        conversion.convertFeelsToSad(feelsAmount);
        
        // Check updated status
        (used, remaining) = conversion.getDailyConversionStatus(user1);
        assertEq(used, feelsAmount);
        assertEq(remaining, 1000 * 10**18 - feelsAmount);
    }
    
    function testAutomationUpkeep() public {
        // Initially no upkeep needed
        (bool upkeepNeeded, ) = conversion.checkUpkeep("");
        assertFalse(upkeepNeeded);
        
        // Fast forward 1 day
        vm.warp(block.timestamp + 1 days);
        
        // Now upkeep should be needed
        (upkeepNeeded, ) = conversion.checkUpkeep("");
        assertTrue(upkeepNeeded);
    }
    
    function testPerformUpkeep() public {
        // Fast forward to make upkeep needed
        vm.warp(block.timestamp + 1 days);
        
        vm.expectEmit(false, false, false, false);
        emit RandomnessRequestedForRate(1);
        
        conversion.performUpkeep("");
        
        // Should have pending request
        assertEq(conversion.pendingRateRequestId(), 1);
    }
    
    function testVRFFulfillmentRateUpdate() public {
        // Trigger rate update
        vm.warp(block.timestamp + 1 days);
        conversion.performUpkeep("");
        
        uint256 oldRate = conversion.currentConversionRate();
        
        // Fulfill with random value that selects rate index 2 (69)
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 2; // Should select index 2
        
        vm.expectEmit(false, false, false, false);
        emit ConversionRateUpdated(oldRate, 69);
        
        mockVRF.fulfillRandomWords(1, randomWords);
        
        assertEq(conversion.currentConversionRate(), 69);
        assertEq(conversion.pendingRateRequestId(), 0);
    }
    
    function testVRFFulfillmentAllRates() public {
        uint256[5] memory rates = [uint256(11), 42, 69, 111, 420];
        uint256 currentTimestamp = block.timestamp;
        
        for (uint256 i = 0; i < 5; i++) {
            // Set up new upkeep - each iteration needs a full day gap
            currentTimestamp += 1 days;
            vm.warp(currentTimestamp);
            conversion.performUpkeep("");
            
            // Fulfill with specific index
            uint256[] memory randomWords = new uint256[](1);
            randomWords[0] = i;
            
            mockVRF.fulfillRandomWords(i + 1, randomWords);
            
            assertEq(conversion.currentConversionRate(), rates[i]);
        }
    }
    
    function testEmergencyUpdateRate() public {
        // Should fail too early
        vm.expectRevert("ConversionContract: Must wait 48 hours");
        conversion.emergencyUpdateRate(0);
        
        // Fast forward 2+ days
        vm.warp(block.timestamp + 2 days + 1);
        
        // Should work now
        conversion.emergencyUpdateRate(4); // Set to 420 rate
        assertEq(conversion.currentConversionRate(), 420);
    }
    
    function testEmergencyUpdateInvalidIndex() public {
        vm.warp(block.timestamp + 3 days);
        
        vm.expectRevert("ConversionContract: Invalid rate index");
        conversion.emergencyUpdateRate(5);
    }
    
    function testGetConversionInfo() public {
        (uint256 rate, uint256 lastUpdate, uint256 nextUpdateIn) = conversion.getConversionInfo();
        
        assertEq(rate, 111); // Initial rate
        assertEq(lastUpdate, block.timestamp); // Should be deployment time
        assertEq(nextUpdateIn, 1 days); // Full day remaining
        
        // Fast forward half day
        vm.warp(block.timestamp + 12 hours);
        
        (, , nextUpdateIn) = conversion.getConversionInfo();
        assertEq(nextUpdateIn, 12 hours); // Half day remaining
    }
    
    function testGetAllConversionRates() public {
        uint256[5] memory rates = conversion.getAllConversionRates();
        
        assertEq(rates[0], 11);
        assertEq(rates[1], 42);
        assertEq(rates[2], 69);
        assertEq(rates[3], 111);
        assertEq(rates[4], 420);
    }
    
    function testCalculateConversion() public {
        uint256 feelsAmount = 555 * 10**18;
        uint256 sadAmount = conversion.calculateConversion(feelsAmount);
        
        assertEq(sadAmount, 5 * 10**18); // 555 / 111 = 5
    }
    
    function testWithdrawETH() public {
        // Purchase some sadness to add ETH to contract
        uint256 ethAmount = 0.1 ether;
        vm.deal(user1, ethAmount);
        
        vm.prank(user1);
        conversion.purchaseSadness{value: ethAmount}();
        
        uint256 initialBalance = address(owner).balance;
        
        // Withdraw as owner (no cooldown for owner operations)
        conversion.withdrawETH();
        
        assertEq(address(owner).balance, initialBalance + ethAmount);
        assertEq(address(conversion).balance, 0);
    }
    
    function testUpdateVRFConfig() public {
        bytes32 newKeyHash = keccak256("new_key");
        uint256 newSubId = 999;
        uint32 newGasLimit = 200000;
        
        conversion.updateVRFConfig(newKeyHash, newSubId, newGasLimit);
        
        // Test that config was updated by performing upkeep
        vm.warp(block.timestamp + 1 days);
        conversion.performUpkeep(""); // Should work with new config
    }
    
    function testOnlyOwnerFunctions() public {
        vm.prank(user1);
        vm.expectRevert();
        conversion.emergencyUpdateRate(0);
        
        vm.prank(user1);
        vm.expectRevert();
        conversion.withdrawETH();
        
        vm.prank(user1);
        vm.expectRevert();
        conversion.updateVRFConfig(bytes32(0), 0, 0);
    }
    
    function testMultipleUsersConversion() public {
        // Give both users FEELS
        feels.generateFeelings(user1, 333 * 10**18, "User1 feelings");
        feels.generateFeelings(user2, 222 * 10**18, "User2 feelings");
        
        // Both convert
        vm.prank(user1);
        conversion.convertFeelsToSad(333 * 10**18);
        
        vm.prank(user2);
        conversion.convertFeelsToSad(222 * 10**18);
        
        // Check balances
        assertEq(sadCoin.balanceOf(user1), 3 * 10**18); // 333/111 = 3
        assertEq(sadCoin.balanceOf(user2), 2 * 10**18); // 222/111 = 2
        
        assertEq(feels.balanceOf(user1), 0);
        assertEq(feels.balanceOf(user2), 0);
    }
    
    function testConversionWithDifferentRates() public {
        uint256 feelsAmount = 420 * 10**18;
        feels.generateFeelings(user1, feelsAmount, "Test feelings");
        
        // Convert at initial rate (111)
        vm.prank(user1);
        conversion.convertFeelsToSad(222 * 10**18);
        assertEq(sadCoin.balanceOf(user1), 2 * 10**18); // 222/111 = 2
        
        // Update rate to 42
        vm.warp(block.timestamp + 1 days);
        conversion.performUpkeep("");
        
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = 1; // Select rate index 1 (42)
        mockVRF.fulfillRandomWords(1, randomWords);
        
        // Convert remaining at new rate (42)
        feels.generateFeelings(user1, 84 * 10**18, "More feelings");
        
        vm.prank(user1);
        conversion.convertFeelsToSad(84 * 10**18);
        assertEq(sadCoin.balanceOf(user1), 4 * 10**18); // Previous 2 + (84/42 = 2) = 4
    }
}