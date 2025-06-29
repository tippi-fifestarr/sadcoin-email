// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice The saddest coin in existence - where being sad is actually good!
/// @dev SADCoin is the primary currency for the "Let's Write an E-Mail" game
contract SADCoin is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1M tokens
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18; // 10M tokens max (very sad)
    
    // Sad addresses that can mint tokens (authorized minters)
    mapping(address => bool) public sadMinters;
    
    // Track how sad each address is (their spending)
    mapping(address => uint256) public sadnessLevel;
    
    // Events for maximum sadness tracking
    event SadMinterAdded(address indexed minter);
    event SadMinterRemoved(address indexed minter);
    event SadnessIncreased(address indexed account, uint256 amount);
    event VerySadBurn(address indexed burner, uint256 amount, string reason);
    
    modifier onlySadMinter() {
        require(sadMinters[msg.sender], "SADCoin: Not sad enough to mint");
        _;
    }
    
    constructor() ERC20("SADCoin", "SAD") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
        sadMinters[msg.sender] = true;
        emit SadMinterAdded(msg.sender);
    }
    
    /// @notice Add a sad minter (someone who can create more sadness)
    function addSadMinter(address minter) external onlyOwner {
        require(minter != address(0), "SADCoin: Cannot make zero address sad");
        sadMinters[minter] = true;
        emit SadMinterAdded(minter);
    }
    
    /// @notice Remove a sad minter (they became too happy)
    function removeSadMinter(address minter) external onlyOwner {
        sadMinters[minter] = false;
        emit SadMinterRemoved(minter);
    }
    
    /// @notice Mint more sadness into existence
    function mintSadness(address to, uint256 amount) external onlySadMinter nonReentrant {
        require(totalSupply() + amount <= MAX_SUPPLY, "SADCoin: Too much sadness for the world");
        require(to != address(0), "SADCoin: Cannot mint sadness to void");
        _mint(to, amount);
    }
    
    /// @notice Burn tokens with a sad reason
    function burnWithSadReason(uint256 amount, string memory reason) external {
        require(amount > 0, "SADCoin: Must burn some sadness");
        require(balanceOf(msg.sender) >= amount, "SADCoin: Not enough sadness to burn");
        
        _burn(msg.sender, amount);
        emit VerySadBurn(msg.sender, amount, reason);
    }
    
    /// @notice Override transfer to track sadness levels
    function transfer(address to, uint256 amount) public override returns (bool) {
        _trackSadness(msg.sender, amount);
        return super.transfer(to, amount);
    }
    
    /// @notice Override transferFrom to track sadness levels
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        _trackSadness(from, amount);
        return super.transferFrom(from, to, amount);
    }
    
    /// @notice Check how sad someone is based on their spending
    function getSadnessLevel(address account) external view returns (uint256) {
        return sadnessLevel[account];
    }
    
    /// @notice Internal function to track how much sadness someone has spent
    function _trackSadness(address account, uint256 amount) internal {
        sadnessLevel[account] += amount;
        emit SadnessIncreased(account, amount);
    }
    
    /// @notice Rescue function for when things get too sad
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner()).transfer(balance);
        }
    }
}