const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventManager and EventTicket Contracts", function () {
    let EventManager, eventManager;
    let EventTicket, eventTicket;
    let owner, creator, attendee, nonWhitelisted;

    beforeEach(async function () {
        // Get test accounts provided by Hardhat
        [owner, creator, attendee, nonWhitelisted] = await ethers.getSigners();

        // Deploy the EventManager contract
        const EventManagerFactory = await ethers.getContractFactory("EventManager");
        eventManager = await EventManagerFactory.deploy();
    });

    // Tests for the whitelist management
    describe("Whitelist Management", function () {
        it("Should allow the owner to add an address to the whitelist", async function () {
            // The owner adds 'creator' to the whitelist
            await eventManager.connect(owner).addToWhitelist(creator.address);
            // Verify that 'creator' is now whitelisted
            expect(await eventManager.isWhitelisted(creator.address)).to.equal(true);
        });

        it("Should NOT allow a non-owner to add to the whitelist", async function () {
            // 'creator' attempts to add 'attendee' to the whitelist. This should fail.
            await expect(
                eventManager.connect(creator).addToWhitelist(attendee.address)
            ).to.be.revertedWith("Only the owner can add to the whitelist");
        });
    });

    // Tests for event creation and ticket minting
    describe("Event Creation and Ticket Minting", function () {
        beforeEach(async function () {
            // For these tests, first add 'creator' to the whitelist
            await eventManager.connect(owner).addToWhitelist(creator.address);
        });

        it("Should allow a whitelisted address to create an event", async function () {
            // 'creator' creates a new event
            await eventManager.connect(creator).createEvent("Concierto de Salsa", "SLS", 100);
            // Verify that the new event address is stored in the registry
            const eventAddress = await eventManager.allEvents(0);
            expect(eventAddress).to.not.equal(ethers.ZeroAddress);
        });
        
        it("Should NOT allow a non-whitelisted address to create an event", async function () {
            // 'nonWhitelisted' tries to create an event. This should fail.
            await expect(
                eventManager.connect(nonWhitelisted).createEvent("Fiesta Privada", "PVT", 50)
            ).to.be.revertedWith("Caller is not whitelisted");
        });

        it("Should allow an attendee to mint a ticket from a created event", async function () {
            // 1. 'creator' creates the event
            await eventManager.connect(creator).createEvent("Concierto de Salsa", "SLS", 100);
            const eventAddress = await eventManager.allEvents(0);

            // 2. Connect to the newly created EventTicket contract
            eventTicket = await ethers.getContractAt("EventTicket", eventAddress);

            // 3. 'attendee' mints a ticket
            await eventTicket.connect(attendee).mintTicket();

            // 4. Verify that the attendee now owns 1 NFT ticket
            expect(await eventTicket.balanceOf(attendee.address)).to.equal(1);
        });
    });

    // Tests for ticket redemption
    describe("Ticket Redemption", function () {
        beforeEach(async function () {
            // Full flow: owner whitelists a creator
            await eventManager.connect(owner).addToWhitelist(creator.address);
            // Creator creates an event
            await eventManager.connect(creator).createEvent("Cine al Parque", "CINE", 100);
            const eventAddress = await eventManager.allEvents(0);
            // Connect to the event contract
            eventTicket = await ethers.getContractAt("EventTicket", eventAddress);
            // An attendee mints a ticket (ID will be 1)
            await eventTicket.connect(attendee).mintTicket();
        });

        it("Should allow the creator to redeem a valid ticket", async function () {
            // Ensure ticket 1 is not redeemed
            expect(await eventTicket.isRedeemed(1)).to.equal(false);
            // Creator redeems ticket 1
            await eventTicket.connect(creator).redeemTicket(1);
            // Check ticket 1 is now redeemed
            expect(await eventTicket.isRedeemed(1)).to.equal(true);
        });

        it("Should NOT allow redeeming a ticket twice", async function () {
            // Redeem ticket 1 once
            await eventTicket.connect(creator).redeemTicket(1);
            // Try redeeming again, expect failure
            await expect(
                eventTicket.connect(creator).redeemTicket(1)
            ).to.be.revertedWith("Ticket has already been redeemed");
        });
        
        it("Should NOT allow an attendee to redeem a ticket", async function () {
            // Attendee tries to redeem their own ticket. This should fail.
            await expect(
                eventTicket.connect(attendee).redeemTicket(1)
            ).to.be.revertedWith("Only the creator can redeem tickets");
        });
    });
});