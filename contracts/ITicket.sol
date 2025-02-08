// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITicket is IERC721 {
    event changedStatus2Using(uint256 tokenId, address owner);
    event IssuedTicket(address to, uint256 tokenId);
    function changeStatus2Using(uint256 tokenId) external;
    function issueTicket(address targetParson, string memory tokenURI) external returns (uint256);
    function getTicketStatus(uint256 tokenId) external view returns(string memory);
    function burn(uint256 tokenId) external;
}