// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Import the ERC721 standard contract from OpenZeppelin.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title EventTicket
 * @dev This is the NFT contract for a single event.
 */
contract EventTicket is ERC721 {
    address public creator;
    uint256 public maxSupply;
    uint256 public nextTokenId;
    mapping(uint256 => bool) public isRedeemed;

    event TicketMinted(address indexed to, uint256 indexed tokenId);
    event TicketRedeemed(uint256 indexed tokenId);

    constructor(string memory _name, string memory _symbol, address _creator, uint256 _maxSupply) ERC721(_name, _symbol) {
        creator = _creator;
        maxSupply = _maxSupply;
        nextTokenId = 1; // Start token IDs from 1
    }

    /**
     * @dev Mints a new ticket (NFT) to the caller's wallet.
     */
    function mintTicket() public {
        require(nextTokenId <= maxSupply, "All tickets have been minted");
        
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        
        nextTokenId++;
        
        emit TicketMinted(msg.sender, tokenId);
    }

    /**
     * @dev Redeems a ticket, marking it as used.
     * Can only be called by the event creator (acting as the verifier).
     * @param _tokenId The ID of the ticket to redeem.
     */
    function redeemTicket(uint256 _tokenId) public {
        require(msg.sender == creator, "Only the creator can redeem tickets");
        require(ownerOf(_tokenId) != address(0), "Ticket does not exist"); // Check if the token has been minted
        require(!isRedeemed[_tokenId], "Ticket has already been redeemed");
        
        isRedeemed[_tokenId] = true;
        
        emit TicketRedeemed(_tokenId);
    }
}