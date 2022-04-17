// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomNumberGenerator is VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;

    mapping(address => uint256[2]) randomNumbersByUser;
    mapping(bytes32 => address) requestIdToUser;

    constructor()
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
        )
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.1 * 10**15;
    }

    function expand(uint256 randomValue, uint256 n)
        public
        pure
        returns (uint256[] memory expandedValues)
    {
        expandedValues = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            expandedValues[i] = uint256(keccak256(abi.encode(randomValue, i)));
        }
        return expandedValues;
    }

    function getRandomNumber() external {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        require(
            randomNumbersByUser[msg.sender][0] == 0,
            "Already requested random number"
        );
        randomNumbersByUser[msg.sender][0] = 6; // Control value
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestIdToUser[requestId] = msg.sender;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        address user = requestIdToUser[requestId];
        uint256[] memory randomNumbers = expand(randomness, 2);
        randomNumbersByUser[user][0] = (randomNumbers[0] % 5) + 1; // Monster avatar
        randomNumbersByUser[user][1] = (randomNumbers[1] % 100) + 1; // Monster power level
    }

    function resetUserRequest(address _user) external {
        randomNumbersByUser[_user][0] = 0;
    }

    function getUserRandomNumbers(address _user)
        external
        view
        returns (uint256[2] memory)
    {
        require(
            randomNumbersByUser[_user][0] != 0,
            "User has not requested random numbers"
        );
        require(
            randomNumbersByUser[_user][0] != 6,
            "Random numbers not yet fulfilled"
        );
        return randomNumbersByUser[_user];
    }
}
