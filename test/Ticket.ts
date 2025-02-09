import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Ticket", function () {
  async function deployTicketFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const Ticket = await hre.ethers.getContractFactory("Ticket");
    const ticket = await Ticket.deploy("TestTicket", "TTP");
    return { ticket, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right name & symbol", async function () {
      const { ticket } = await loadFixture(deployTicketFixture);

      expect(await ticket.name()).to.equal("TestTicket");
      expect(await ticket.symbol()).to.equal("TTP");
    });
  });

  describe("Functions", function () {
    describe("issueTicket", function () {
      it("Can be issued.", async function () {
        const { ticket, owner, otherAccount } = await loadFixture(
          deployTicketFixture
        );
        await expect(ticket.issueTicket(otherAccount.address, "testURI0"))
          .to.emit(ticket, "IssuedTicket")
          .withArgs(otherAccount.address, 0);
        expect(await ticket.tokenURI(0), "tokenURI0");
        expect(await ticket.ownerOf(0), otherAccount.address);

        await expect(ticket.issueTicket(owner.address, "testURI1"))
          .to.emit(ticket, "IssuedTicket")
          .withArgs(owner.address, 1);
        expect(await ticket.tokenURI(1), "tokenURI1");
        expect(await ticket.ownerOf(1), owner.address);

        expect(ticket.getTicketStatus(0), "Issued(Hakken-Zumi)");
        expect(ticket.getTicketStatus(1), "Issued(Hakken-Zumi)");
      });

      it("Non owner can not issue ticket", async function () {
        const { ticket, owner, otherAccount } = await loadFixture(
          deployTicketFixture
        );
        await expect(
          ticket.connect(otherAccount).issueTicket(owner.address, "testURI2")
        ).to.be.reverted;
      });
    });
    describe("Change status", function () {
      it("Can be changed by the owner of the ticket", async function () {
        const { ticket, owner, otherAccount } = await loadFixture(
          deployTicketFixture
        );
        await expect(ticket.issueTicket(otherAccount.address, "testURI0"))
          .to.emit(ticket, "IssuedTicket")
          .withArgs(otherAccount.address, 0);
        expect(await ticket.tokenURI(0), "tokenURI0");
        expect(await ticket.ownerOf(0), otherAccount.address);

        expect(ticket.getTicketStatus(0), "Issued(Hakken-Zumi)");

        await expect(ticket.connect(otherAccount).changeStatus2Using(0))
          .to.emit(ticket, "changedStatus2Using")
          .withArgs(0, otherAccount.address);

        expect(ticket.getTicketStatus(0), "Using(Shiyou-chuu)");
      });
      it("Can not be changed by the non-owner of the ticket", async function () {
        const { ticket, owner, otherAccount } = await loadFixture(
          deployTicketFixture
        );
        await expect(ticket.issueTicket(otherAccount.address, "testURI0"))
          .to.emit(ticket, "IssuedTicket")
          .withArgs(otherAccount.address, 0);
        expect(await ticket.tokenURI(0), "tokenURI0");
        expect(await ticket.ownerOf(0), otherAccount.address);

        expect(ticket.getTicketStatus(0), "Issued(Hakken-Zumi)");

        await expect(ticket.connect(owner).changeStatus2Using(0)).to.be
          .reverted;

        expect(ticket.getTicketStatus(0), "Issued(Hakken-Zumi)");
      });
    });
    describe("Burn", function () {
      it("Can be burned by the owner of the conract", async function () {
        const { ticket, owner, otherAccount } = await loadFixture(
          deployTicketFixture
        );
        await expect(ticket.issueTicket(otherAccount.address, "testURI0"))
          .to.emit(ticket, "IssuedTicket")
          .withArgs(otherAccount.address, 0);
        expect(await ticket.tokenURI(0), "tokenURI0");
        expect(await ticket.ownerOf(0), otherAccount.address);

        expect(ticket.getTicketStatus(0), "Issued(Hakken-Zumi)");

        await ticket.burn(0);
      });
      it("Can not be burned by the non-owner of the conract", async function () {
        const { ticket, owner, otherAccount } = await loadFixture(
          deployTicketFixture
        );
        await expect(ticket.issueTicket(otherAccount.address, "testURI0"))
          .to.emit(ticket, "IssuedTicket")
          .withArgs(otherAccount.address, 0);
        expect(await ticket.tokenURI(0), "tokenURI0");
        expect(await ticket.ownerOf(0), otherAccount.address);

        expect(ticket.getTicketStatus(0), "Issued(Hakken-Zumi)");

        await expect(ticket.connect(otherAccount).burn(0))
        .to.be.reverted;
      });
    });
  });
});
