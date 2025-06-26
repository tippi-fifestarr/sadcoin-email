// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/SADCoin.sol";

/// @notice Tests for the SADCoin token - ensuring maximum sadness
contract SADCoinTest is Test {
    SADCoin public sadCoin;
    address public owner;
    address public user1;
    address public user2;
    address public sadMinter;
    
    uint256 constant INITIAL_SUPPLY = 1_000_000 * 10**18;
    uint256 constant TEST_AMOUNT = 100 * 10**18;
    
    event SadMinterAdded(address indexed minter);
    event SadMinterRemoved(address indexed minter);
    event SadnessIncreased(address indexed account, uint256 amount);
    event VerySadBurn(address indexed burner, uint256 amount, string reason);
    
    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        sadMinter = makeAddr("sadMinter");
        
        sadCoin = new SADCoin();
    }
    
    function testInitialState() public {
        assertEq(sadCoin.name(), "SADCoin");
        assertEq(sadCoin.symbol(), "SAD");
        assertEq(sadCoin.totalSupply(), INITIAL_SUPPLY);
        assertEq(sadCoin.balanceOf(owner), INITIAL_SUPPLY);
        assertTrue(sadCoin.sadMinters(owner));
    }
    
    function testAddSadMinter() public {
        assertFalse(sadCoin.sadMinters(sadMinter));
        
        vm.expectEmit(true, false, false, false);
        emit SadMinterAdded(sadMinter);
        
        sadCoin.addSadMinter(sadMinter);
        assertTrue(sadCoin.sadMinters(sadMinter));
    }
    
    function testRemoveSadMinter() public {
        sadCoin.addSadMinter(sadMinter);
        assertTrue(sadCoin.sadMinters(sadMinter));
        
        vm.expectEmit(true, false, false, false);
        emit SadMinterRemoved(sadMinter);
        
        sadCoin.removeSadMinter(sadMinter);
        assertFalse(sadCoin.sadMinters(sadMinter));
    }
    
    function testMintSadness() public {
        uint256 initialBalance = sadCoin.balanceOf(user1);
        uint256 initialSupply = sadCoin.totalSupply();
        
        sadCoin.mintSadness(user1, TEST_AMOUNT);
        
        assertEq(sadCoin.balanceOf(user1), initialBalance + TEST_AMOUNT);
        assertEq(sadCoin.totalSupply(), initialSupply + TEST_AMOUNT);
    }
    
    function testMintSadnessOnlyByMinter() public {
        vm.prank(user1);
        vm.expectRevert("SADCoin: Not sad enough to mint");
        sadCoin.mintSadness(user2, TEST_AMOUNT);
    }
    
    function testMintSadnessMaxSupply() public {
        uint256 maxSupply = sadCoin.MAX_SUPPLY();
        uint256 currentSupply = sadCoin.totalSupply();
        uint256 overLimit = maxSupply - currentSupply + 1;
        
        vm.expectRevert("SADCoin: Too much sadness for the world");
        sadCoin.mintSadness(user1, overLimit);
    }
    
    function testBurnWithSadReason() public {
        string memory sadReason = "Lost my job, very sad";
        
        // Transfer some tokens to user1 first
        sadCoin.transfer(user1, TEST_AMOUNT);
        
        vm.startPrank(user1);
        
        uint256 initialBalance = sadCoin.balanceOf(user1);
        uint256 initialSupply = sadCoin.totalSupply();
        
        vm.expectEmit(true, false, false, true);
        emit VerySadBurn(user1, TEST_AMOUNT, sadReason);
        
        sadCoin.burnWithSadReason(TEST_AMOUNT, sadReason);
        
        assertEq(sadCoin.balanceOf(user1), initialBalance - TEST_AMOUNT);
        assertEq(sadCoin.totalSupply(), initialSupply - TEST_AMOUNT);
        
        vm.stopPrank();
    }
    
    function testBurnWithSadReasonInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert("SADCoin: Not enough sadness to burn");
        sadCoin.burnWithSadReason(TEST_AMOUNT, "Trying to burn sadness I don't have");
    }
    
    function testSadnessTracking() public {
        sadCoin.transfer(user1, TEST_AMOUNT);
        
        vm.startPrank(user1);
        
        assertEq(sadCoin.getSadnessLevel(user1), 0);
        
        vm.expectEmit(true, false, false, true);
        emit SadnessIncreased(user1, TEST_AMOUNT / 2);
        
        sadCoin.transfer(user2, TEST_AMOUNT / 2);
        
        assertEq(sadCoin.getSadnessLevel(user1), TEST_AMOUNT / 2);
        
        vm.stopPrank();
    }
    
    function testTransferFromSadnessTracking() public {
        sadCoin.transfer(user1, TEST_AMOUNT);
        
        vm.prank(user1);
        sadCoin.approve(user2, TEST_AMOUNT / 2);
        
        assertEq(sadCoin.getSadnessLevel(user1), 0);
        
        vm.prank(user2);
        sadCoin.transferFrom(user1, user2, TEST_AMOUNT / 2);
        
        assertEq(sadCoin.getSadnessLevel(user1), TEST_AMOUNT / 2);
    }
    
    function testOnlyOwnerFunctions() public {
        vm.startPrank(user1);
        
        vm.expectRevert();
        sadCoin.addSadMinter(user2);
        
        vm.expectRevert();
        sadCoin.removeSadMinter(owner);
        
        vm.expectRevert();
        sadCoin.emergencyWithdraw();
        
        vm.stopPrank();
    }
    
    function testEmergencyWithdraw() public {
        // Send some ETH to the contract
        vm.deal(address(sadCoin), 1 ether);
        
        uint256 initialBalance = address(this).balance;
        
        sadCoin.emergencyWithdraw();
        
        assertEq(address(this).balance, initialBalance + 1 ether);
        assertEq(address(sadCoin).balance, 0);
    }
    
    // Allow test contract to receive ETH
    receive() external payable {}
    
    function testCannotAddZeroAddressAsMinter() public {
        vm.expectRevert("SADCoin: Cannot make zero address sad");
        sadCoin.addSadMinter(address(0));
    }
    
    function testCannotMintToZeroAddress() public {
        vm.expectRevert("SADCoin: Cannot mint sadness to void");
        sadCoin.mintSadness(address(0), TEST_AMOUNT);
    }
    
    function testCannotBurnZeroAmount() public {
        vm.expectRevert("SADCoin: Must burn some sadness");
        sadCoin.burnWithSadReason(0, "No sadness to burn");
    }
}