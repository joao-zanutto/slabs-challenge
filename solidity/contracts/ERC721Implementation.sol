// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./RandomNumberGenerator.sol";
import "./ERC20Implementation.sol";

contract ERC721Implementation is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    RandomNumberGenerator private rand;
    ERC20Implementation private token;
    uint private price = 15 ether;

    event MonsterCreated(address indexed owner, uint256 indexed tokenId);

    struct Monster {
        uint256 id;
        uint8 powerLevel;
        string avatarUrl;
    }

    mapping(address => Monster[]) private _monstersByOwner;

    constructor(address _randAddress, address _tokenAddress)
        ERC721("LABMONSTER", "LBM")
    {
        rand = RandomNumberGenerator(_randAddress);
        token = ERC20Implementation(_tokenAddress);
    }

    function awardItem() external returns (uint256) {
        require(token.balanceOf(msg.sender) >= price, "Not enough tokens");
        require(
            token.allowance(msg.sender, address(this)) >= price,
            "Not enough allowance"
        );

        token.transferFrom(msg.sender, address(this), price);

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        string memory tokenUri = _generateMonster(msg.sender, newItemId);
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenUri);

        emit MonsterCreated(msg.sender, newItemId);

        return newItemId;
    }

    function getMonsters(address player)
        public
        view
        returns (Monster[] memory)
    {
        return _monstersByOwner[player];
    }

    function donateTokens(address receiver) external {
        token.transfer(receiver, price);
    }

    function _generateMonster(address player, uint256 id)
        internal
        returns (string memory)
    {
        uint256[2] memory randomValues = rand.getUserRandomNumbers(player);

        Monster memory monster = Monster(
            id,
            uint8(randomValues[1]),
            _parseUrl(randomValues[0])
        );
        _monstersByOwner[player].push(monster);

        rand.resetUserRequest(player);

        return _generateTokenUri(monster);
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
            memory prefix = "https://ipfs.io/ipfs/QmZWzAUMs8G7Bp9a1w8Kawu8UR71d5mipkyD9f49hsgHm3/monster-";
        string memory suffix = ".png";
        return
            string(
                abi.encodePacked(prefix, Strings.toString(avatarId), suffix)
            );
    }
}
