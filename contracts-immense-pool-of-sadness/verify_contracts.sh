#!/bin/bash

# Set your Etherscan API key
export ETHERSCAN_API_KEY=""

echo "Verifying SadCoin contracts on Sepolia..."

# 1. SADCoin
echo "Verifying SADCoin..."
forge verify-contract 0x7845B4894F2b2D2475314215163D797D4395d8Fb src/SADCoin.sol:SADCoin --chain sepolia --etherscan-api-key $ETHERSCAN_API_KEY

# 2. FEELS
echo "Verifying FEELS..."
forge verify-contract 0x1C25c8e0855952CaDF85898239D53B62719Fb2ab src/FEELS.sol:FEELS --chain sepolia --etherscan-api-key $ETHERSCAN_API_KEY

# 3. StakingContract
echo "Verifying StakingContract..."
forge verify-contract 0x0f03aBf42014798fA0742befedf404100e07060D src/StakingContract.sol:StakingContract --chain sepolia --etherscan-api-key $ETHERSCAN_API_KEY --constructor-args $(cast abi-encode "constructor(address,address)" 0x7845B4894F2b2D2475314215163D797D4395d8Fb 0x1C25c8e0855952CaDF85898239D53B62719Fb2ab)

# 4. GameRewards
echo "Verifying GameRewards..."
forge verify-contract 0xdf8D2B48FC3007726d80cEf15c5CC41C6eEaDaE8 src/GameRewards.sol:GameRewards --chain sepolia --etherscan-api-key $ETHERSCAN_API_KEY --constructor-args $(cast abi-encode "constructor(address,address,bytes32,uint256)" 0x5CE8D5A2BC84beb22a398CCA51996F7930313D61 0x1C25c8e0855952CaDF85898239D53B62719Fb2ab 0x1770bdc7eec7771f7ba4ffd640f34260d7f095b79c92d34a5b2551d6f6cfd2be 112471577075721091854264773675545125245900460458976497301714233269987091787170)

# 5. ConversionContract
echo "Verifying ConversionContract..."
forge verify-contract 0x61fBE2CDa9d2a41c7A09843106eBD55A43790F54 src/ConversionContract.sol:ConversionContract --chain sepolia --etherscan-api-key $ETHERSCAN_API_KEY --constructor-args $(cast abi-encode "constructor(address,address,address,address,bytes32,uint256)" 0x7845B4894F2b2D2475314215163D797D4395d8Fb 0x1C25c8e0855952CaDF85898239D53B62719Fb2ab 0x694AA1769357215DE4FAC081bf1f309aDC325306 0x5CE8D5A2BC84beb22a398CCA51996F7930313D61 0x1770bdc7eec7771f7ba4ffd640f34260d7f095b79c92d34a5b2551d6f6cfd2be 112471577075721091854264773675545125245900460458976497301714233269987091787170)

# 6. NFTClaim
echo "Verifying NFTClaim..."
forge verify-contract 0x9E23590b10AD7fb256ce7BBAEc1D2d1B39bD1f2F src/NFTClaim.sol:NFTClaim --chain sepolia --etherscan-api-key $ETHERSCAN_API_KEY --constructor-args $(cast abi-encode "constructor(address,bytes32)" 0x649A2DA509887A4C4a049c16e15a3952E8E8b60D 0xb643dffbd3f64268f511939ebff70b607b6996d71c8482a14c110b1e75d4bbcb)

echo "Verification complete!" 