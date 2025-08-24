const { ethers } = require("hardhat");

const eventManagerAddress = "0x9FfDCbe41a99846adfd9251E5C21860F36eB3751"; // eventmannager desplegado

async function main() {
  console.log("Conectando al EventManager...");
  const eventManager = await ethers.getContractAt("EventManager", eventManagerAddress);

  const eventsCount = await eventManager.getEventsCount();
  const count = Number(eventsCount);

  if (count === 0) {
    console.log("No se ha creado ningún evento todavía.");
    return;
  }

  const latestEventAddress = await eventManager.allEvents(count - 1);

  console.log("====================================================");
  console.log("La dirección del último evento creado es:");
  console.log(latestEventAddress);
  console.log("====================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});