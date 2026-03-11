import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const host = accounts.get("wallet_1")!;
const guest = accounts.get("wallet_2")!;
const guest2 = accounts.get("wallet_3")!;

function setupBooking(propertyOwner = host, bookingGuest = guest, checkIn = 100) {
  // 1. List property
  const { result: propRes } = simnet.callPublicFn(
    "escrow",
    "list-property",
    [Cl.uint(1000000), Cl.uint(1), Cl.uint(1), Cl.stringAscii("ipfs://test")],
    propertyOwner
  );
  const propertyId = (propRes as any).value.value;

  // 2. Book property
  const { result: bookRes } = simnet.callPublicFn(
    "escrow",
    "book-property",
    [Cl.uint(propertyId), Cl.uint(checkIn), Cl.uint(checkIn + 5), Cl.uint(5)],
    bookingGuest
  );
  const bookingId = (bookRes as any).value.value;

  // 3. Mine and release
  simnet.mineEmptyBlocks(checkIn + 10);
  simnet.callPublicFn("escrow", "release-payment", [Cl.uint(bookingId)], bookingGuest);

  return Number(bookingId);
}

describe("Aether Reputation Contract", () => {
  beforeEach(() => {
    simnet.setEpoch("3.0");
  });

  describe("Review Submission", () => {
    it("allows a guest to submit a review for a completed booking", () => {
      const bookingId = setupBooking();
      const { result } = simnet.callPublicFn(
        "reputation",
        "submit-review",
        [Cl.uint(bookingId), Cl.principal(host), Cl.uint(5), Cl.stringUtf8("Great!")],
        guest
      );
      expect(result.type).toBe("ok");
    });

    it("allows a host to review a guest", () => {
      const bookingId = setupBooking();
      const { result } = simnet.callPublicFn(
        "reputation",
        "submit-review",
        [Cl.uint(bookingId), Cl.principal(guest), Cl.uint(4), Cl.stringUtf8("Good guest")],
        host
      );
      expect(result.type).toBe("ok");
    });

    it("rejects self-review", () => {
      const bookingId = setupBooking();
      const { result } = simnet.callPublicFn(
        "reputation",
        "submit-review",
        [Cl.uint(bookingId), Cl.principal(guest), Cl.uint(5), Cl.stringUtf8("I'm great!")],
        guest
      );
      expect(result).toStrictEqual(Cl.error(Cl.uint(200)));
    });

    it("rejects duplicate review", () => {
      const bookingId = setupBooking();
      simnet.callPublicFn(
        "reputation",
        "submit-review",
        [Cl.uint(bookingId), Cl.principal(host), Cl.uint(5), Cl.stringUtf8("G")],
        guest
      );
      const { result } = simnet.callPublicFn(
        "reputation",
        "submit-review",
        [Cl.uint(bookingId), Cl.principal(host), Cl.uint(4), Cl.stringUtf8("G2")],
        guest
      );
      expect(result).toStrictEqual(Cl.error(Cl.uint(202)));
    });
  });

  describe("Reputation Queries", () => {
    it("tracks user stats correctly", () => {
      const bookingId = setupBooking();
      simnet.callPublicFn(
        "reputation",
        "submit-review",
        [Cl.uint(bookingId), Cl.principal(host), Cl.uint(5), Cl.stringUtf8("G")],
        guest
      );
      const { result } = simnet.callReadOnlyFn(
        "reputation",
        "get-user-average-rating",
        [Cl.principal(host)],
        guest
      );
      expect(result).toStrictEqual(Cl.uint(500));
    });

    it("returns review count", () => {
      const { result } = simnet.callReadOnlyFn(
        "reputation",
        "get-review-count",
        [],
        guest
      );
      expect(Number((result as any).value)).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Superhost Badge", () => {
    it("mints superhost badge after 10 high-rated reviews", () => {
      // Clear host stats effectively by reviewing a different party many times if needed? 
      // No, we just need 10 reviews for 'host'.

      for (let i = 0; i < 10; i++) {
        const bid = setupBooking(host, guest, 1000 + i * 20);
        simnet.callPublicFn(
          "reputation",
          "submit-review",
          [Cl.uint(bid), Cl.principal(host), Cl.uint(5), Cl.stringUtf8("G")],
          guest
        );
      }

      const { result } = simnet.callReadOnlyFn(
        "badge",
        "has-badge",
        [Cl.principal(host), Cl.uint(3)],
        host
      );
      expect(result).toStrictEqual(Cl.bool(true));
    });
  });
});
