// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/FEELS.sol";

/// @notice Tests for the FEELS token - testing emotional damage
contract FEELSTest is Test {
    FEELS public feels;
    address public admin;
    address public minter;
    address public burner;
    address public user1;
    address public user2;
    
    uint256 constant TEST_AMOUNT = 100 * 10**18;
    string constant TEST_SOURCE = "Test sadness generation";
    string constant TEST_REASON = "Test emotional damage";
    
    event FeelingsGenerated(address indexed recipient, uint256 amount, string source);
    event FeelingsDestroyed(address indexed account, uint256 amount, string reason);
    event EmotionalDamageInflicted(address indexed victim, uint256 damage);
    
    function setUp() public {
        admin = address(this);
        minter = makeAddr("minter");
        burner = makeAddr("burner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        feels = new FEELS();
        
        // Grant roles
        feels.grantRole(feels.MINTER_ROLE(), minter);
        feels.grantRole(feels.BURNER_ROLE(), burner);
    }
    
    function testInitialState() public {
        assertEq(feels.name(), "FEELS");
        assertEq(feels.symbol(), "FEELS");
        assertEq(feels.totalSupply(), 0);
        assertTrue(feels.hasRole(feels.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(feels.hasRole(feels.MINTER_ROLE(), admin));
        assertTrue(feels.hasRole(feels.BURNER_ROLE(), admin));
    }
    
    function testGenerateFeelings() public {
        vm.startPrank(minter);
        
        vm.expectEmit(true, false, false, true);
        emit FeelingsGenerated(user1, TEST_AMOUNT, TEST_SOURCE);
        
        feels.generateFeelings(user1, TEST_AMOUNT, TEST_SOURCE);
        
        assertEq(feels.balanceOf(user1), TEST_AMOUNT);
        assertEq(feels.totalSupply(), TEST_AMOUNT);
        assertEq(feels.lastFeelTime(user1), block.timestamp);
        
        vm.stopPrank();
    }
    
    function testGenerateFeelingsOnlyMinter() public {
        vm.prank(user1);
        vm.expectRevert("FEELS: Not authorized to generate feelings");
        feels.generateFeelings(user2, TEST_AMOUNT, TEST_SOURCE);
    }
    
    function testGenerateFeelingsMaxSupply() public {
        uint256 maxSupply = feels.MAX_SUPPLY();
        
        vm.prank(minter);
        vm.expectRevert("FEELS: Too many feelings in the world");
        feels.generateFeelings(user1, maxSupply + 1, TEST_SOURCE);
    }
    
    function testDestroyFeelings() public {
        // First generate some feelings
        vm.prank(minter);
        feels.generateFeelings(user1, TEST_AMOUNT, TEST_SOURCE);
        
        vm.startPrank(burner);
        
        vm.expectEmit(true, false, false, true);
        emit FeelingsDestroyed(user1, TEST_AMOUNT / 2, TEST_REASON);
        
        vm.expectEmit(true, false, false, true);
        emit EmotionalDamageInflicted(user1, TEST_AMOUNT / 2);
        
        feels.destroyFeelings(user1, TEST_AMOUNT / 2, TEST_REASON);
        
        assertEq(feels.balanceOf(user1), TEST_AMOUNT / 2);
        assertEq(feels.emotionalDamage(user1), TEST_AMOUNT / 2);
        
        vm.stopPrank();
    }
    
    function testDestroyFeelingsOnlyBurner() public {
        vm.prank(minter);
        feels.generateFeelings(user1, TEST_AMOUNT, TEST_SOURCE);
        
        vm.prank(user1);
        vm.expectRevert("FEELS: Not authorized to destroy feelings");
        feels.destroyFeelings(user1, TEST_AMOUNT, TEST_REASON);
    }
    
    function testSufferVoluntarily() public {
        // First generate some feelings
        vm.prank(minter);
        feels.generateFeelings(user1, TEST_AMOUNT, TEST_SOURCE);
        
        vm.startPrank(user1);
        
        vm.expectEmit(true, false, false, true);
        emit FeelingsDestroyed(user1, TEST_AMOUNT / 2, "Voluntary suffering");
        
        vm.expectEmit(true, false, false, true);
        emit EmotionalDamageInflicted(user1, TEST_AMOUNT / 2);
        
        feels.sufferVoluntarily(TEST_AMOUNT / 2, "Voluntary suffering");
        
        assertEq(feels.balanceOf(user1), TEST_AMOUNT / 2);
        assertEq(feels.emotionalDamage(user1), TEST_AMOUNT / 2);
        
        vm.stopPrank();
    }
    
    function testSufferVoluntarilyInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert("FEELS: Not enough feelings to suffer with");
        feels.sufferVoluntarily(TEST_AMOUNT, "Trying to suffer without feelings");
    }
    
    function testCalculateFeelingIntensity() public {
        // First time feeling
        assertEq(feels.calculateFeelingIntensity(user1), 100);
        
        // Generate feelings to set lastFeelTime
        vm.prank(minter);
        feels.generateFeelings(user1, TEST_AMOUNT, TEST_SOURCE);
        
        // Same block - should be low intensity
        assertEq(feels.calculateFeelingIntensity(user1), 50);
        
        // After 1 hour
        vm.warp(block.timestamp + 1 hours + 1);
        assertEq(feels.calculateFeelingIntensity(user1), 150);
        
        // After 1 day
        vm.warp(block.timestamp + 1 days);
        assertEq(feels.calculateFeelingIntensity(user1), 200);
    }
    
    function testTransferUpdatesFeelTime() public {
        vm.prank(minter);
        feels.generateFeelings(user1, TEST_AMOUNT, TEST_SOURCE);
        
        uint256 initialTime = feels.lastFeelTime(user1);
        
        // Move time forward
        vm.warp(block.timestamp + 1 hours);
        
        vm.prank(user1);
        feels.transfer(user2, TEST_AMOUNT / 2);
        
        // Both users should have updated feel times
        assertEq(feels.lastFeelTime(user1), block.timestamp);
        assertEq(feels.lastFeelTime(user2), block.timestamp);
        assertGt(feels.lastFeelTime(user1), initialTime);
    }
    
    function testTransferFromUpdatesFeelTime() public {
        vm.prank(minter);
        feels.generateFeelings(user1, TEST_AMOUNT, TEST_SOURCE);
        
        vm.prank(user1);
        feels.approve(user2, TEST_AMOUNT / 2);
        
        uint256 initialTime = feels.lastFeelTime(user1);
        
        // Move time forward
        vm.warp(block.timestamp + 1 hours);
        
        vm.prank(user2);
        feels.transferFrom(user1, user2, TEST_AMOUNT / 2);
        
        // Both users should have updated feel times
        assertEq(feels.lastFeelTime(user1), block.timestamp);
        assertEq(feels.lastFeelTime(user2), block.timestamp);
        assertGt(feels.lastFeelTime(user1), initialTime);
    }
    
    function testGetEmotionalDamage() public {
        assertEq(feels.getEmotionalDamage(user1), 0);
        
        vm.prank(minter);
        feels.generateFeelings(user1, TEST_AMOUNT, TEST_SOURCE);
        
        vm.prank(burner);
        feels.destroyFeelings(user1, TEST_AMOUNT / 2, TEST_REASON);
        
        assertEq(feels.getEmotionalDamage(user1), TEST_AMOUNT / 2);
    }
    
    function testGetLastFeelTime() public {
        assertEq(feels.getLastFeelTime(user1), 0);
        
        vm.prank(minter);
        feels.generateFeelings(user1, TEST_AMOUNT, TEST_SOURCE);
        
        assertEq(feels.getLastFeelTime(user1), block.timestamp);
    }
    
    function testCannotGenerateToZeroAddress() public {
        vm.prank(minter);
        vm.expectRevert("FEELS: Cannot feel nothing");
        feels.generateFeelings(address(0), TEST_AMOUNT, TEST_SOURCE);
    }
    
    function testCannotGenerateZeroAmount() public {
        vm.prank(minter);
        vm.expectRevert("FEELS: Must feel something");
        feels.generateFeelings(user1, 0, TEST_SOURCE);
    }
    
    function testCannotDestroyFromZeroAddress() public {
        vm.prank(burner);
        vm.expectRevert("FEELS: Cannot destroy nothing");
        feels.destroyFeelings(address(0), TEST_AMOUNT, TEST_REASON);
    }
    
    function testCannotDestroyZeroAmount() public {
        vm.prank(burner);
        vm.expectRevert("FEELS: Must destroy something");
        feels.destroyFeelings(user1, 0, TEST_REASON);
    }
    
    function testCannotSufferZeroAmount() public {
        vm.prank(user1);
        vm.expectRevert("FEELS: Must suffer something");
        feels.sufferVoluntarily(0, "No suffering");
    }
}