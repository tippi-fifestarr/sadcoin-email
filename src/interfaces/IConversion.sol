// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Interface for the sad conversion contract
interface IConversion {
    event SadCoinPurchased(address indexed buyer, uint256 sadAmount, uint256 ethPaid, uint256 ethPrice);
    event FeelsConvertedToSad(address indexed converter, uint256 feelsAmount, uint256 sadAmount, uint256 rate);
    event ConversionRateUpdated(uint256 oldRate, uint256 newRate);
    
    function purchaseSadness() external payable;
    function convertFeelsToSad(uint256 feelsAmount) external;
    function getConversionInfo() external view returns (
        uint256 rate,
        uint256 lastUpdate,
        uint256 nextUpdateIn
    );
    function getDailyConversionStatus(address user) external view returns (
        uint256 usedToday,
        uint256 remainingToday
    );
    function calculatePurchaseAmount(uint256 ethAmount) external view returns (uint256 sadAmount, uint256 ethPriceUSD);
    function calculateConversion(uint256 feelsAmount) external view returns (uint256 sadAmount);
    function getAllConversionRates() external view returns (uint256[5] memory);
}