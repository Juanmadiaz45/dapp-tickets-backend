// Import the ethers library from Hardhat, which allows us to interact with the blockchain.
const { ethers } = require("hardhat");

async function main() {
    console.log("Getting the deployed contract...");
    
    // The address of the deployed EventManager contract. 
    // This needs to be updated after each new deployment on a fresh network.
    const eventManagerAddress = "0x8773f556eb804d6Cd179F6106CB8a9d2E3d94845";
    
    // Get the first three accounts provided by the local network (Ganache).
    // - `owner`: The account that deployed the EventManager contract.
    // - `creator`: An account that will be whitelisted to create events.
    // - `attendee`: An account that will mint a ticket for an event.
    const [owner, creator, attendee] = await ethers.getSigners();
    
    // Get a contract instance for the deployed EventManager, which allows us to call its functions.
    const eventManager = await ethers.getContractAt("EventManager", eventManagerAddress);
    console.log(`Connected to EventManager at address: ${eventManager.target}`);
    
    // Whitelist a creator
    console.log(`\nWhitelisting creator: ${creator.address}...`);
    // The `owner` of the contract calls `addToWhitelist` to grant permission to the `creator` account.
    const txWhitelist = await eventManager.connect(owner).addToWhitelist(creator.address);
    // Wait for the transaction to be mined and confirmed.
    await txWhitelist.wait();
    console.log("Creator successfully whitelisted!");
    
    // Verify that the creator is now whitelisted.
    const isWhitelisted = await eventManager.isWhitelisted(creator.address);
    console.log(`Is ${creator.address} whitelisted? -> ${isWhitelisted}`);

    // Create an event
    console.log("\nCreating a new event...");
    // The `creator` (who is now whitelisted) calls `createEvent` to deploy a new EventTicket contract.
    const txCreateEvent = await eventManager.connect(creator).createEvent("Feria de Cali", "FDC", 200);
    await txCreateEvent.wait();
    console.log("Event created successfully!");

    // Get the address of the newly created EventTicket contract from the EventManager's public array.
    const newEventContractAddress = await eventManager.allEvents(0);
    console.log(`New event contract deployed at address: ${newEventContractAddress}`);

    // Mint/Buy a ticket
    console.log("\nAn attendee is minting a ticket...");

    // To interact with the new event's ticket contract, we need to get its instance using its address.
    const eventTicket = await ethers.getContractAt("EventTicket", newEventContractAddress);
    console.log(`Connected to the event contract at: ${eventTicket.target}`);

    // Check the attendee's ticket balance before minting.
    let balance = await eventTicket.balanceOf(attendee.address);
    console.log(`Attendee's ticket balance BEFORE minting: ${balance.toString()}`);

    // The `attendee` account calls the `mintTicket` function.
    const txMint = await eventTicket.connect(attendee).mintTicket();
    await txMint.wait();
    console.log("Ticket successfully minted for the attendee!");

    // Check the attendee's ticket balance after minting to confirm they received the NFT.
    balance = await eventTicket.balanceOf(attendee.address);
    console.log(`Attendee's ticket balance AFTER minting: ${balance.toString()}`);

    // We can also verify the owner of a specific token ID (the first ticket minted will have ID 1).
    const ownerOfTicket1 = await eventTicket.ownerOf(1);
    console.log(`Owner of Ticket #1: ${ownerOfTicket1}`);
    console.log(`Attendee's address: ${attendee.address}`);
}

// Standard pattern to run the main function and handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });