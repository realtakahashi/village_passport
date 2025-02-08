import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("VillagePassport", function () {
  async function deployVillagePassportFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const VillagePassort = await hre.ethers.getContractFactory(
      "VillagePassport"
    );
    const villagePassort = await VillagePassort.deploy("TestVillage", "TVP");
    return { villagePassort, owner, otherAccount };
  }

  async function deployTicket1Fixture() {
    const Ticket1 = await hre.ethers.getContractFactory("Ticket");
    const ticket1 = await Ticket1.deploy("Accomodation Ticket 1", "AT1");
    return ticket1;
  }

  async function deployTicket2Fixture() {
    const Ticket2 = await hre.ethers.getContractFactory("Ticket");
    const ticket2 = await Ticket2.deploy("Accomodation Ticket 2", "AT2");
    return ticket2;
  }

  describe("Deployment", function () {
    it("Should set the right name & symbol", async function () {
      const { villagePassort } = await loadFixture(
        deployVillagePassportFixture
      );

      expect(await villagePassort.name()).to.equal("TestVillage");
      expect(await villagePassort.symbol()).to.equal("TVP");
    });
  });

  describe("Functions", function () {
    describe("Add Passport", function () {
      it("Can be added NFT.", async function () {
        const { villagePassort, owner, otherAccount } = await loadFixture(
          deployVillagePassportFixture
        );
        await expect(
          villagePassort.addPassort(otherAccount.address, "testURI0")
        )
          .to.emit(villagePassort, "AddedPassport")
          .withArgs(otherAccount.address, 0);
        expect(await villagePassort.tokenURI(0), "tokenURI0");
        expect(await villagePassort.ownerOf(0), otherAccount.address);

        await expect(villagePassort.addPassort(owner.address, "testURI1"))
          .to.emit(villagePassort, "AddedPassport")
          .withArgs(owner.address, 1);
        expect(await villagePassort.tokenURI(1), "tokenURI1");
        expect(await villagePassort.ownerOf(1), owner.address);
      });

      it("Non owner can not add the passport", async function () {
        const { villagePassort, owner, otherAccount } = await loadFixture(
          deployVillagePassportFixture
        );
        await expect(
          villagePassort
            .connect(otherAccount)
            .addPassort(owner.address, "testURI2")
        ).to.be.reverted;
      });
    });
    describe("Add Passport", function () {
      it("Adding tickets test", async function () {
        const { villagePassort, owner, otherAccount } = await loadFixture(
          deployVillagePassportFixture
        );
        await expect(
          villagePassort.addPassort(otherAccount.address, "testURI0")
        )
          .to.emit(villagePassort, "AddedPassport")
          .withArgs(otherAccount.address, 0);
        expect(await villagePassort.tokenURI(0), "tokenURI0");
        expect(await villagePassort.ownerOf(0), otherAccount.address);

        const ticket1 = await loadFixture(deployTicket1Fixture);
        const ticket2 = await loadFixture(deployTicket2Fixture);
        await expect(
          villagePassort.addTicket(ticket1.name(), ticket1.getAddress())
        )
          .to.emit(villagePassort, "AddedTicket")
          .withArgs(0, ticket1.name(), ticket1.getAddress());
        await expect(
          villagePassort.addTicket(ticket2.name(), ticket2.getAddress())
        )
          .to.emit(villagePassort, "AddedTicket")
          .withArgs(1, ticket2.name(), ticket2.getAddress());

        const tickets = await villagePassort.getAlltickets();
        expect(tickets[0][0], "Accomodation Ticket 1");
        expect(tickets[0][1], ticket1.getAddress());
        expect(tickets[1][0], "Accomodation Ticket 2");
        expect(tickets[1][1], ticket2.getAddress());

        await expect(ticket1.issueTicket(otherAccount.address, "Ticket1URI"))
          .to.emit(ticket1, "IssuedTicket")
          .withArgs(otherAccount.address, 0);

        const status1 = await villagePassort
          .connect(otherAccount)
          .checkTicketStatus(0, 0, 0);
        expect(status1, "Issued(Hakken-Zumi)");

        await expect(ticket1.connect(otherAccount).changeStatus2Using(0))
          .to.emit(ticket1, "changedStatus2Using")
          .withArgs(0, otherAccount.address);

        const status2 = await villagePassort
          .connect(otherAccount)
          .checkTicketStatus(0, 0, 0);
        expect(status1, "Using(Shiyou-chuu)");

        await ticket1.burn(0);
        await expect(ticket1.connect(otherAccount).ownerOf(0)).to.be.reverted;
      });
      it("Non owner can not add ticket", async function () {
        const { villagePassort, owner, otherAccount } = await loadFixture(
            deployVillagePassportFixture
          );
          await expect(
            villagePassort.addPassort(otherAccount.address, "testURI0")
          )
            .to.emit(villagePassort, "AddedPassport")
            .withArgs(otherAccount.address, 0);
          expect(await villagePassort.tokenURI(0), "tokenURI0");
          expect(await villagePassort.ownerOf(0), otherAccount.address);
  
          const ticket1 = await loadFixture(deployTicket1Fixture);
          const ticket2 = await loadFixture(deployTicket2Fixture);
          await expect(
            villagePassort.connect(otherAccount).addTicket(ticket1.name(), ticket1.getAddress())
          ).to.be.reverted;
  
      });
    });
  });
});
