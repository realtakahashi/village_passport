import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("VillagePassport", function () {
    async function deployVillagePassportFixture() {  
      const [owner, otherAccount] = await hre.ethers.getSigners();  
      const VillagePassort = await hre.ethers.getContractFactory("VillagePassport");
      const villagePassort = await VillagePassort.deploy("TestVillage","TVP");  
      return { villagePassort, owner, otherAccount };
    }
  
    describe("Deployment", function () {
      it("Should set the right name & symbol", async function () {
        const { villagePassort } = await loadFixture(deployVillagePassportFixture);
  
        expect(await villagePassort.name()).to.equal("TestVillage");
        expect(await villagePassort.symbol()).to.equal("TVP");
      });
    });

    describe("Functions", function () {
      describe("Add Passport", function () {
        it("Can be added NFT.", async function () {
          const { villagePassort, owner, otherAccount } = await loadFixture(deployVillagePassportFixture);
          await expect(villagePassort.addPassort(otherAccount.address, "testURI0"))
            .to.emit(villagePassort,"AddedPassport")
            .withArgs(otherAccount.address,0);
          expect(await villagePassort.tokenURI(0),"tokenURI0");
          expect(await villagePassort.ownerOf(0), otherAccount.address);

          await expect(villagePassort.addPassort(owner.address, "testURI1"))
            .to.emit(villagePassort,"AddedPassport")
            .withArgs(owner.address,1);
          expect(await villagePassort.tokenURI(1),"tokenURI1");
          expect(await villagePassort.ownerOf(1), owner.address);
        });

        it("Non owner can not add the passport", async function() {
            const { villagePassort, owner, otherAccount } = await loadFixture(deployVillagePassportFixture);
            await expect(villagePassort.connect(otherAccount).addPassort(owner.address, "testURI2"))
            .to.be.reverted;            
        });
      });
    });
  
  });
  