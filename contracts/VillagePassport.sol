// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract VillagePassport is ERC721URIStorage,Ownable {
    uint256 private _nextTokenId;

    event AddedPassport(address to, uint256 tokenId);

    constructor(string memory villageName, string memory symbol) ERC721(villageName, symbol) Ownable(msg.sender){}

    function addPassort(address targetParson, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(targetParson, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit AddedPassport(targetParson,tokenId);
        return tokenId;
    }
}