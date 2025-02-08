// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ITicket} from "./ITicket.sol";

contract VillagePassport is ERC721URIStorage,Ownable {
    struct Ticket {
        string name;
        address addressOfErc721; 
    }
    
    uint256 private _nextTokenId;
    uint256 private _nextTicketId;
    mapping(uint256 ticketId => Ticket) private _tickets;
    
    event AddedPassport(address to, uint256 tokenId);
    event AddedTicket(uint256 ticketId, string ticketName, address addressOfErc721);

    constructor(string memory villageName, string memory symbol) ERC721(villageName, symbol) Ownable(msg.sender){}

    function addPassort(address targetParson, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(targetParson, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit AddedPassport(targetParson,tokenId);
        return tokenId;
    }

    function addTicket(string memory ticketName, address addressOfErc721 ) external onlyOwner {
        uint256 ticketId = _nextTicketId++;
        _tickets[ticketId] = Ticket(ticketName, addressOfErc721);
        emit AddedTicket(ticketId, ticketName, addressOfErc721);
    }

    function getAlltickets() public view returns(Ticket[] memory){
        Ticket[] memory tickets = new Ticket[](_nextTicketId);
        for (uint256 i=0;i<_nextTicketId;i++){
            tickets[i]=_tickets[i];
        }
        return tickets;
    }

    function checkTicketStatus(uint256 tokenId, uint256 ticketId,uint256 ticketTokenId) external view returns(string memory){
        require(ownerOf(tokenId)==msg.sender,"Should be owner(Anata ha degital juumin de ha nai).");
        Ticket memory ticket = _tickets[ticketId];
        ITicket ticketContract = ITicket(ticket.addressOfErc721);
        return ticketContract.getTicketStatus(ticketTokenId);

    }
}