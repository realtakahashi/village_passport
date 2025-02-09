// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ITicket} from "./ITicket.sol";

contract Ticket is ERC721URIStorage,Ownable,ITicket {
    
    uint256 private _nextTokenId;
    mapping(uint256 tokenId => string) _ticketStatus;

    constructor(string memory ticketName, string memory symbol) 
        ERC721(ticketName, symbol) 
        Ownable(msg.sender){}

    function issueTicket(address targetParson, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(targetParson, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _ticketStatus[tokenId] = "Issued(Hakken-Zumi)";
        emit IssuedTicket(targetParson,tokenId);
        return tokenId;
    }

    function changeStatus2Using(uint256 tokenId) external {
        require(ownerOf(tokenId)==msg.sender,"Should be owner(Anata ha ticket wo motte nai)");
        _ticketStatus[tokenId] = "Using(Shiyou-chuu)";
        emit changedStatus2Using(tokenId,msg.sender);
    }

    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

    function getTicketStatus(uint256 tokenId) external view returns(string memory){
        return _ticketStatus[tokenId];
    }
}