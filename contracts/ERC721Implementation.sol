// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./RandomNumberGenerator.sol";

contract ERC721Implementation is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    RandomNumberGenerator private rand;

    struct Monster {
        uint256 id;
        uint8 powerLevel;
        string avatarUrl;
    }

    mapping(address => Monster[]) private _monstersByOwner;

    constructor(address _randAddress) ERC721("LABMONSTER", "LBM") {
        rand = RandomNumberGenerator(_randAddress);
    }

    function awardItem(address player) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        uint256[2] memory randomValues = rand.getUserRandomNumbers(player);

        Monster memory monster = Monster(
            newItemId,
            uint8(randomValues[1]),
            _parseUrl(randomValues[0])
        );
        _monstersByOwner[player].push(monster);

        rand.resetUserRequest(player);

        _mint(player, newItemId);
        _setTokenURI(newItemId, _generateTokenUri(monster));

        return newItemId;
    }

    function getMonsters(address player)
        public
        view
        returns (Monster[] memory)
    {
        return _monstersByOwner[player];
    }

    function _generateTokenUri(Monster memory monster)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '{"name":"Monster #',
                    Strings.toString(monster.id),
                    '", "description": "monster with power level ',
                    Strings.toString(monster.powerLevel),
                    '", "image":',
                    monster.avatarUrl,
                    ', "attributes": [{"trait_type": "Level", "value": "',
                    Strings.toString(monster.powerLevel),
                    '"}]}'
                )
            );
    }

    function _parseUrl(uint256 avatarId) internal pure returns (string memory) {
        string
            memory prefix = "https://ipfs.io/ipfs/QmRwwu7otcPitjzrjrqWzuZyivPkusAAP6RYqwjX4dhcxN?filename=monster-";
        string memory suffix = ".png";
        return
            string(
                abi.encodePacked(prefix, Strings.toString(avatarId), suffix)
            );
    }
}
