const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EventManagerModule", (m) => {
  const eventManager = m.contract("EventManager");

  return { eventManager };
});