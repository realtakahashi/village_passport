// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VILLAGE_NAME: string = "Degital Nakatsugawa";
const SYMBOL: string = "DNP";

const VillagePassortModule = buildModule("VillagePassportModule", (m) => {
  const villageName = m.getParameter("villageName", VILLAGE_NAME);
  const symbol = m.getParameter("symbol", SYMBOL);

  const villagePassort = m.contract("VillagePassport",[villageName,symbol]);

  return { villagePassort };
});

export default VillagePassortModule;
