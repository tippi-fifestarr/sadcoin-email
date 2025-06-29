// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice FEELS token - earned through sadness, lost through conversion
/// @dev Only authorized contracts can mint FEELS, representing emotional labor
contract FEELS is ERC20, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M FEELS max
    
    // Track emotional events
    mapping(address => uint256) public emotionalDamage;
    mapping(address => uint256) public lastFeelTime;
    
    event FeelingsGenerated(address indexed recipient, uint256 amount, string source);
    event FeelingsDestroyed(address indexed account, uint256 amount, string reason);
    event EmotionalDamageInflicted(address indexed victim, uint256 damage);
    
    modifier onlyFeelingMachine() {
        require(hasRole(MINTER_ROLE, msg.sender), "FEELS: Not authorized to generate feelings");
        _;
    }
    
    modifier onlyEmotionalDestroyer() {
        require(hasRole(BURNER_ROLE, msg.sender), "FEELS: Not authorized to destroy feelings");
        _;
    }
    
    constructor() ERC20("FEELS", "FEELS") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }
    
    /// @notice Mint FEELS with emotional context
    function generateFeelings(
        address recipient, 
        uint256 amount, 
        string memory source
    ) external onlyFeelingMachine nonReentrant {
        require(recipient != address(0), "FEELS: Cannot feel nothing");
        require(amount > 0, "FEELS: Must feel something");
        require(totalSupply() + amount <= MAX_SUPPLY, "FEELS: Too many feelings in the world");
        
        lastFeelTime[recipient] = block.timestamp;
        _mint(recipient, amount);
        
        emit FeelingsGenerated(recipient, amount, source);
    }
    
    /// @notice Burn FEELS with emotional context
    function destroyFeelings(
        address account, 
        uint256 amount, 
        string memory reason
    ) external onlyEmotionalDestroyer nonReentrant {
        require(account != address(0), "FEELS: Cannot destroy nothing");
        require(amount > 0, "FEELS: Must destroy something");
        require(balanceOf(account) >= amount, "FEELS: Not enough feelings to destroy");
        
        emotionalDamage[account] += amount;
        _burn(account, amount);
        
        emit FeelingsDestroyed(account, amount, reason);
        emit EmotionalDamageInflicted(account, amount);
    }
    
    /// @notice Allow users to voluntarily destroy their own feelings
    function sufferVoluntarily(uint256 amount, string memory reason) external {
        require(amount > 0, "FEELS: Must suffer something");
        require(balanceOf(msg.sender) >= amount, "FEELS: Not enough feelings to suffer with");
        
        emotionalDamage[msg.sender] += amount;
        _burn(msg.sender, amount);
        
        emit FeelingsDestroyed(msg.sender, amount, reason);
        emit EmotionalDamageInflicted(msg.sender, amount);
    }
    
    /// @notice Check emotional damage level
    function getEmotionalDamage(address account) external view returns (uint256) {
        return emotionalDamage[account];
    }
    
    /// @notice Check when someone last felt something
    function getLastFeelTime(address account) external view returns (uint256) {
        return lastFeelTime[account];
    }
    
    /// @notice Calculate feeling intensity based on time since last feel
    function calculateFeelingIntensity(address account) external view returns (uint256) {
        if (lastFeelTime[account] == 0) return 100; // First time feeling, very intense
        
        uint256 timeSinceLastFeel = block.timestamp - lastFeelTime[account];
        
        // The longer without feelings, the more intense the next one
        if (timeSinceLastFeel > 1 days) return 200; // Very intense after a day
        if (timeSinceLastFeel > 1 hours) return 150; // Moderate intensity after an hour
        return 50; // Recent feelings are less intense
    }
    
    /// @notice Override transfer to update feel times
    function transfer(address to, uint256 amount) public override returns (bool) {
        lastFeelTime[msg.sender] = block.timestamp;
        lastFeelTime[to] = block.timestamp;
        return super.transfer(to, amount);
    }
    
    /// @notice Override transferFrom to update feel times
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        lastFeelTime[from] = block.timestamp;
        lastFeelTime[to] = block.timestamp;
        return super.transferFrom(from, to, amount);
    }
}