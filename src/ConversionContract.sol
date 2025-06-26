// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import "./SADCoin.sol";
import "./FEELS.sol";

/// @notice Conversion contract with sad rates and daily randomized sadness
/// @dev Allows purchasing SADCoin for $0.01 and converting FEELS to SAD at random sad rates
contract ConversionContract is ReentrancyGuard, Ownable, AutomationCompatibleInterface {
    SADCoin public immutable sadCoin;
    FEELS public immutable feels;
    AggregatorV3Interface public immutable priceFeed; // ETH/USD price feed
    IVRFCoordinatorV2Plus private immutable vrfCoordinator;
    
    // VRF Configuration
    bytes32 private keyHash;
    uint256 private subscriptionId;
    uint32 private callbackGasLimit = 100000;
    uint16 private requestConfirmations = 3;
    uint32 private numWords = 1;
    
    // Sad conversion rates - the five numbers of ultimate sadness
    uint256[5] public SAD_CONVERSION_RATES = [11, 42, 69, 111, 420];
    uint256 public currentConversionRate = 111; // Start with 111 FEELS = 1 SAD
    uint256 public lastRateUpdate;
    uint256 public pendingRateRequestId;
    
    // Purchase configuration
    uint256 public constant SAD_PRICE_CENTS = 1; // 1 cent per SADCoin
    uint256 public constant PURCHASE_COOLDOWN = 1 hours; // 1 hour between purchases
    
    mapping(address => uint256) public lastPurchaseTime;
    mapping(address => uint256) public totalSadPurchased;
    mapping(address => uint256) public totalFeelsConverted;
    
    // Daily conversion limits to prevent too much happiness
    mapping(address => mapping(uint256 => uint256)) public dailyConversions; // user => day => amount
    uint256 public constant MAX_DAILY_CONVERSION = 1000 * 10**18; // 1000 SAD max per day
    
    event SadCoinPurchased(address indexed buyer, uint256 sadAmount, uint256 ethPaid, uint256 ethPrice);
    event FeelsConvertedToSad(address indexed converter, uint256 feelsAmount, uint256 sadAmount, uint256 rate);
    event ConversionRateUpdated(uint256 oldRate, uint256 newRate);
    event RandomnessRequestedForRate(uint256 requestId);
    event PurchaseLimitReached(address indexed buyer, uint256 attemptedAmount);
    event DailyConversionLimitReached(address indexed converter, uint256 attemptedAmount);
    
    modifier cooldownPassed() {
        require(
            lastPurchaseTime[msg.sender] == 0 || block.timestamp >= lastPurchaseTime[msg.sender] + PURCHASE_COOLDOWN,
            "ConversionContract: Must wait between purchases (the sadness of waiting)"
        );
        _;
    }
    
    constructor(
        address _sadCoin,
        address _feels,
        address _priceFeed,
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint256 _subscriptionId
    ) Ownable(msg.sender) {
        require(_sadCoin != address(0), "ConversionContract: SADCoin cannot be nothing");
        require(_feels != address(0), "ConversionContract: FEELS cannot be nothing");
        require(_priceFeed != address(0), "ConversionContract: Price feed cannot be nothing");
        
        sadCoin = SADCoin(_sadCoin);
        feels = FEELS(_feels);
        priceFeed = AggregatorV3Interface(_priceFeed);
        vrfCoordinator = IVRFCoordinatorV2Plus(_vrfCoordinator);
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
        lastRateUpdate = block.timestamp;
    }
    
    /// @notice Purchase SADCoin for exactly 1 cent each
    function purchaseSadness() external payable cooldownPassed nonReentrant {
        require(msg.value > 0, "ConversionContract: Must send ETH to buy sadness");
        
        // Get current ETH price from Chainlink
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        require(price > 0, "ConversionContract: Invalid price data");
        require(block.timestamp - updatedAt <= 3600, "ConversionContract: Price data too old");
        
        uint256 ethPriceUSD = uint256(price) * 10**10; // Convert to 18 decimals
        
        // Calculate how many SADCoins can be bought (each costs $0.01)
        uint256 sadAmount = (msg.value * ethPriceUSD) / (SAD_PRICE_CENTS * 10**16); // $0.01 = 10^16 wei worth of USD
        
        require(sadAmount > 0, "ConversionContract: Not enough ETH for even one sad coin");
        
        lastPurchaseTime[msg.sender] = block.timestamp;
        totalSadPurchased[msg.sender] += sadAmount;
        
        // Mint SADCoins to buyer
        sadCoin.mintSadness(msg.sender, sadAmount);
        
        emit SadCoinPurchased(msg.sender, sadAmount, msg.value, ethPriceUSD);
    }
    
    /// @notice Convert FEELS to SADCoin at current sad rate
    function convertFeelsToSad(uint256 feelsAmount) external nonReentrant {
        require(feelsAmount > 0, "ConversionContract: Must convert some feelings");
        require(feels.balanceOf(msg.sender) >= feelsAmount, "ConversionContract: Not enough feelings");
        
        // Check daily limit
        uint256 today = block.timestamp / 1 days;
        require(
            dailyConversions[msg.sender][today] + feelsAmount <= MAX_DAILY_CONVERSION,
            "ConversionContract: Daily conversion limit reached"
        );
        
        // Calculate SAD amount based on current rate
        uint256 sadAmount = feelsAmount / currentConversionRate;
        require(sadAmount > 0, "ConversionContract: Not enough FEELS for conversion");
        
        // Update daily conversion tracking
        dailyConversions[msg.sender][today] += feelsAmount;
        totalFeelsConverted[msg.sender] += feelsAmount;
        
        // Burn FEELS and mint SAD
        feels.destroyFeelings(msg.sender, feelsAmount, "Converted to SAD - the ultimate sadness");
        sadCoin.mintSadness(msg.sender, sadAmount);
        
        emit FeelsConvertedToSad(msg.sender, feelsAmount, sadAmount, currentConversionRate);
    }
    
    /// @notice Get current conversion rate info
    function getConversionInfo() external view returns (
        uint256 rate,
        uint256 lastUpdate,
        uint256 nextUpdateIn
    ) {
        uint256 timeSinceUpdate = block.timestamp - lastRateUpdate;
        uint256 nextUpdate = timeSinceUpdate >= 1 days ? 0 : 1 days - timeSinceUpdate;
        
        return (currentConversionRate, lastRateUpdate, nextUpdate);
    }
    
    /// @notice Get user's daily conversion status
    function getDailyConversionStatus(address user) external view returns (
        uint256 usedToday,
        uint256 remainingToday
    ) {
        uint256 today = block.timestamp / 1 days;
        uint256 used = dailyConversions[user][today];
        uint256 remaining = used >= MAX_DAILY_CONVERSION ? 0 : MAX_DAILY_CONVERSION - used;
        
        return (used, remaining);
    }
    
    // Chainlink Automation functions for daily rate updates
    
    /// @notice Check if upkeep is needed for rate update
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = (block.timestamp - lastRateUpdate) >= 1 days && pendingRateRequestId == 0;
        return (upkeepNeeded, "");
    }
    
    /// @notice Perform upkeep - request new random rate
    function performUpkeep(bytes calldata) external override {
        require((block.timestamp - lastRateUpdate) >= 1 days, "ConversionContract: Too early for rate update");
        require(pendingRateRequestId == 0, "ConversionContract: Rate update already pending");
        
        // Request randomness for new conversion rate
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
        
        pendingRateRequestId = requestId;
        emit RandomnessRequestedForRate(requestId);
    }
    
    /// @notice Chainlink VRF callback entry point
    function rawFulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) external {
        require(msg.sender == address(vrfCoordinator), "ConversionContract: Only VRF coordinator can fulfill");
        fulfillRandomWords(requestId, randomWords);
    }
    
    /// @notice VRF callback to set new conversion rate
    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal {
        require(requestId == pendingRateRequestId, "ConversionContract: Invalid request ID");
        
        // Pick one of the 5 sad conversion rates
        uint256 rateIndex = randomWords[0] % 5;
        uint256 oldRate = currentConversionRate;
        currentConversionRate = SAD_CONVERSION_RATES[rateIndex];
        lastRateUpdate = block.timestamp;
        pendingRateRequestId = 0;
        
        emit ConversionRateUpdated(oldRate, currentConversionRate);
    }
    
    /// @notice Manual rate update in case VRF fails (emergency sadness)
    function emergencyUpdateRate(uint256 rateIndex) external onlyOwner {
        require(rateIndex < 5, "ConversionContract: Invalid rate index");
        require(block.timestamp > lastRateUpdate + 2 days, "ConversionContract: Must wait 48 hours");
        
        uint256 oldRate = currentConversionRate;
        currentConversionRate = SAD_CONVERSION_RATES[rateIndex];
        lastRateUpdate = block.timestamp;
        pendingRateRequestId = 0;
        
        emit ConversionRateUpdated(oldRate, currentConversionRate);
    }
    
    /// @notice Withdraw accumulated ETH from purchases
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "ConversionContract: No ETH to withdraw");
        
        payable(owner()).transfer(balance);
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
    
    /// @notice Get all conversion rates
    function getAllConversionRates() external view returns (uint256[5] memory) {
        return SAD_CONVERSION_RATES;
    }
    
    /// @notice Calculate how much SADCoin can be purchased with given ETH
    function calculatePurchaseAmount(uint256 ethAmount) external view returns (uint256 sadAmount, uint256 ethPriceUSD) {
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        require(price > 0 && block.timestamp - updatedAt <= 3600, "ConversionContract: Invalid or stale price");
        
        ethPriceUSD = uint256(price) * 10**10;
        sadAmount = (ethAmount * ethPriceUSD) / (SAD_PRICE_CENTS * 10**16);
        
        return (sadAmount, ethPriceUSD);
    }
    
    /// @notice Calculate how much SAD can be obtained from FEELS
    function calculateConversion(uint256 feelsAmount) external view returns (uint256 sadAmount) {
        return feelsAmount / currentConversionRate;
    }
}