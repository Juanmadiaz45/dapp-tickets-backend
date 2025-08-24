// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./EventTicket.sol";

/**
 * @title EventManager
 * @dev Manages whitelisted creators and the creation of new event contracts.
 */
contract EventManager {
    address public owner;
    mapping(address => bool) public isWhitelisted;
    address[] public allEvents;

    event EventCreated(address indexed creator, address indexed eventContractAddress);

    constructor() {
        // The address that deploys this contract becomes the owner.
        owner = msg.sender;
        // The owner is automatically whitelisted.
        isWhitelisted[msg.sender] = true;
    }

    /**
     * @dev Adds a new address to the whitelist. Only the owner can call this.
     * @param _creator The address of the new event creator.
     */
    function addToWhitelist(address _creator) public {
        require(msg.sender == owner, "Only the owner can add to the whitelist");
        isWhitelisted[_creator] = true;
    }

    /**
     * @dev Removes an address from the whitelist. Only the owner can call this.
     * @param _creator The address to remove.
     */
    function removeFromWhitelist(address _creator) public {
        require(msg.sender == owner, "Only the owner can remove from the whitelist");
        isWhitelisted[_creator] = false;
    }

    /**
     * @dev Returns the entire array of created event contract addresses.
     * This allows the frontend to easily fetch all events.
     */
    function getAllEvents() public view returns (address[] memory) {
        return allEvents;
    }

    /**
     * @dev Returns the total number of events created.
     */
    function getEventsCount() public view returns (uint256) {
        return allEvents.length;
    }

    /**
     * @dev Creates a new event by deploying a new EventTicket contract.
     * @param _name The name of the NFT collection.
     * @param _symbol The symbol for the NFT.
     * @param _maxSupply The maximum number of tickets that can be minted.
     */
    function createEvent(string memory _name, string memory _symbol, uint256 _maxSupply) public {
        require(isWhitelisted[msg.sender], "Caller is not whitelisted");
        
        // Deploys a new instance of the EventTicket contract.
        EventTicket newEvent = new EventTicket(_name, _symbol, msg.sender, _maxSupply);
        
        // Stores the address of the newly created contract.
        allEvents.push(address(newEvent));
        
        emit EventCreated(msg.sender, address(newEvent));
    }
}