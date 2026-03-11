import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const host = accounts.get("wallet_1")!;
const guest = accounts.get("wallet_2")!;
const guest2 = accounts.get("wallet_3")!;

describe("Aether Dispute Contract", () => {
  let disputeIdNonce = 0;

  beforeEach(() => {
    disputeIdNonce = 0;

    // Authorize dispute contract in escrow (Admin only)
    const disputeContractAddress = `${deployer}.dispute`;
    simnet.callPublicFn(
      "escrow",
      "set-dispute-contract",
      [Cl.principal(disputeContractAddress)],
      deployer
    );

    const disRes = simnet.callReadOnlyFn("dispute", "get-dispute-count", [], host);
    if (disRes.result && (disRes.result as any).type === 18) { // ResponseOk
      disputeIdNonce = Number((disRes.result as any).value.value);
    }
  });

  // Helper function to create a booking
  const createBooking = (propertyOwner: string, bookingGuest: string) => {
    // 1. List a property
    const { result: propRes } = simnet.callPublicFn(
      "escrow",
      "list-property",
      [Cl.uint(1000000), Cl.uint(1), Cl.uint(1), Cl.stringAscii("ipfs://test")],
      propertyOwner
    );
    const propertyId = (propRes as any).value.value;

    // 2. Book the property
    const { result: bookRes } = simnet.callPublicFn(
      "escrow",
      "book-property",
      [Cl.uint(propertyId), Cl.uint(1000), Cl.uint(1005), Cl.uint(5)],
      bookingGuest
    );
    const bookingId = (bookRes as any).value.value;

    return Number(bookingId);
  };

  const setupDispute = (propertyOwner = host, bookingGuest = guest) => {
    const bookingId = createBooking(propertyOwner, bookingGuest);
    const curDisId = disputeIdNonce++;
    simnet.callPublicFn(
      "dispute",
      "raise-dispute",
      [Cl.uint(bookingId), Cl.stringUtf8("Issue"), Cl.stringUtf8("Evidence")],
      bookingGuest
    );
    return { bookingId, disputeId: curDisId };
  };

  describe("Raising Disputes", () => {
    it("allows guest to raise a dispute", () => {
      const bookingId = createBooking(host, guest);

      const { result } = simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [
          Cl.uint(bookingId),
          Cl.stringUtf8("Property not as described"),
          Cl.stringUtf8("Photos show different furniture"),
        ],
        guest
      );

      expect(result).toStrictEqual(Cl.ok(Cl.uint(disputeIdNonce++)));
    });

    it("allows host to raise a dispute", () => {
      const bookingId = createBooking(host, guest);

      const { result } = simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [
          Cl.uint(bookingId),
          Cl.stringUtf8("Guest caused damage"),
          Cl.stringUtf8("Broken furniture and stains"),
        ],
        host
      );

      expect(result).toStrictEqual(Cl.ok(Cl.uint(disputeIdNonce++)));
    });

    it("stores dispute details correctly", () => {
      const bookingId = createBooking(host, guest);
      const reason = "Cleanliness issues";
      const evidence = "Photos of dirty rooms";

      const expectedDisputeId = disputeIdNonce++;
      simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [Cl.uint(bookingId), Cl.stringUtf8(reason), Cl.stringUtf8(evidence)],
        guest
      );

      const { result } = simnet.callReadOnlyFn(
        "dispute",
        "get-dispute",
        [Cl.uint(expectedDisputeId)],
        guest
      );

      expect(result).toStrictEqual(Cl.some(
        Cl.tuple({
          "booking-id": Cl.uint(bookingId),
          "raised-by": Cl.principal(guest),
          reason: Cl.stringUtf8(reason),
          evidence: Cl.stringUtf8(evidence),
          status: Cl.stringAscii("pending"),
          resolution: Cl.stringUtf8(""),
          "refund-percentage": Cl.uint(0),
          "created-at": Cl.uint(simnet.blockHeight),
          "resolved-at": Cl.uint(0),
        })
      ));
    });

    it("increments dispute ID for each new dispute", () => {
      const bid0 = createBooking(host, guest);
      const bid1 = createBooking(host, guest2);

      const id0 = disputeIdNonce++;
      const { result: res1 } = simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [Cl.uint(bid0), Cl.stringUtf8("I1"), Cl.stringUtf8("E1")],
        guest
      );
      expect(res1).toStrictEqual(Cl.ok(Cl.uint(id0)));

      const id1 = disputeIdNonce++;
      const { result: res2 } = simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [Cl.uint(bid1), Cl.stringUtf8("I2"), Cl.stringUtf8("E2")],
        guest2
      );
      expect(res2).toStrictEqual(Cl.ok(Cl.uint(id1)));
    });

    it("rejects dispute from unauthorized user", () => {
      const bookingId = createBooking(host, guest);
      const { result } = simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [Cl.uint(bookingId), Cl.stringUtf8("Unauthorized"), Cl.stringUtf8("Evidence")],
        guest2
      );
      expect(result).toStrictEqual(Cl.error(Cl.uint(300))); // ERR-NOT-AUTHORIZED
    });

    it("rejects duplicate dispute for same booking", () => {
      const bookingId = createBooking(host, guest);
      simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [Cl.uint(bookingId), Cl.stringUtf8("First"), Cl.stringUtf8("E")],
        guest
      );
      disputeIdNonce++;

      const { result } = simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [Cl.uint(bookingId), Cl.stringUtf8("Second"), Cl.stringUtf8("E")],
        host
      );
      expect(result).toStrictEqual(Cl.error(Cl.uint(303))); // ERR-DISPUTE-ALREADY-EXISTS
    });

    it("rejects dispute for non-existent booking", () => {
      const { result } = simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [Cl.uint(999), Cl.stringUtf8("Issue"), Cl.stringUtf8("Evidence")],
        guest
      );
      expect(result).toStrictEqual(Cl.error(Cl.uint(301))); // ERR-BOOKING-NOT-FOUND
    });
  });

  describe("Dispute Resolution", () => {
    it("allows admin to resolve dispute with partial refund", () => {
      const { disputeId } = setupDispute();
      const { result } = simnet.callPublicFn(
        "dispute",
        "resolve-dispute",
        [Cl.uint(disputeId), Cl.stringUtf8("Resolved 50%"), Cl.uint(50)],
        deployer
      );
      expect(result).toStrictEqual(Cl.ok(Cl.bool(true)));
    });

    it("updates dispute status to resolved", () => {
      const { disputeId } = setupDispute();
      simnet.callPublicFn(
        "dispute",
        "resolve-dispute",
        [Cl.uint(disputeId), Cl.stringUtf8("Resolved"), Cl.uint(100)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "dispute",
        "get-dispute-status",
        [Cl.uint(disputeId)],
        guest
      );
      expect(result).toStrictEqual(Cl.some(Cl.stringAscii("resolved")));
    });

    it("stores resolution details correctly", () => {
      const { bookingId, disputeId } = setupDispute();
      const resolution = "Full refund";
      const refund = 100;

      const resolveHeight = simnet.blockHeight + 1;
      simnet.callPublicFn(
        "dispute",
        "resolve-dispute",
        [Cl.uint(disputeId), Cl.stringUtf8(resolution), Cl.uint(refund)],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "dispute",
        "get-dispute",
        [Cl.uint(disputeId)],
        guest
      );

      expect(result).toStrictEqual(Cl.some(
        Cl.tuple({
          "booking-id": Cl.uint(bookingId),
          "raised-by": Cl.principal(guest),
          reason: Cl.stringUtf8("Issue"),
          evidence: Cl.stringUtf8("Evidence"),
          status: Cl.stringAscii("resolved"),
          resolution: Cl.stringUtf8(resolution),
          "refund-percentage": Cl.uint(refund),
          "created-at": Cl.uint(resolveHeight - 1),
          "resolved-at": Cl.uint(resolveHeight),
        })
      ));
    });

    it("rejects resolution from non-admin", () => {
      const { disputeId } = setupDispute();
      const { result } = simnet.callPublicFn(
        "dispute",
        "resolve-dispute",
        [Cl.uint(disputeId), Cl.stringUtf8("Unauthorized"), Cl.uint(50)],
        guest
      );
      expect(result).toStrictEqual(Cl.error(Cl.uint(300))); // ERR-NOT-AUTHORIZED
    });

    it("rejects resolving already resolved dispute", () => {
      const { disputeId } = setupDispute();
      simnet.callPublicFn(
        "dispute",
        "resolve-dispute",
        [Cl.uint(disputeId), Cl.stringUtf8("R1"), Cl.uint(50)],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "dispute",
        "resolve-dispute",
        [Cl.uint(disputeId), Cl.stringUtf8("R2"), Cl.uint(50)],
        deployer
      );
      expect(result).toStrictEqual(Cl.error(Cl.uint(304))); // ERR-DISPUTE-ALREADY-RESOLVED
    });

    it("rejects invalid refund percentage (>100)", () => {
      const { disputeId } = setupDispute();
      const { result } = simnet.callPublicFn(
        "dispute",
        "resolve-dispute",
        [Cl.uint(disputeId), Cl.stringUtf8("Bad refund"), Cl.uint(150)],
        deployer
      );
      expect(result).toStrictEqual(Cl.error(Cl.uint(305))); // ERR-INVALID-REFUND
    });
  });

  describe("Dispute Queries", () => {
    it("returns correct booking dispute information", () => {
      const { bookingId, disputeId } = setupDispute();
      const { result } = simnet.callReadOnlyFn(
        "dispute",
        "get-booking-dispute",
        [Cl.uint(bookingId)],
        guest
      );

      expect(result).toStrictEqual(Cl.some(
        Cl.tuple({
          "dispute-id": Cl.uint(disputeId),
          exists: Cl.bool(true),
        })
      ));
    });

    it("returns none for booking without dispute", () => {
      const bookingId = createBooking(host, guest);
      const { result } = simnet.callReadOnlyFn(
        "dispute",
        "get-booking-dispute",
        [Cl.uint(bookingId)],
        guest
      );
      expect(result).toStrictEqual(Cl.none());
    });

    it("correctly checks if dispute is resolved", () => {
      const { disputeId } = setupDispute();

      const { result: before } = simnet.callReadOnlyFn(
        "dispute",
        "is-dispute-resolved",
        [Cl.uint(disputeId)],
        guest
      );
      expect(before).toStrictEqual(Cl.bool(false));

      simnet.callPublicFn(
        "dispute",
        "resolve-dispute",
        [Cl.uint(disputeId), Cl.stringUtf8("R"), Cl.uint(50)],
        deployer
      );

      const { result: after } = simnet.callReadOnlyFn(
        "dispute",
        "is-dispute-resolved",
        [Cl.uint(disputeId)],
        guest
      );
      expect(after).toStrictEqual(Cl.bool(true));
    });

    it("returns current dispute count", () => {
      const { result: initial } = simnet.callReadOnlyFn(
        "dispute",
        "get-dispute-count",
        [],
        guest
      );
      const startCount = Number((initial as any).value);

      setupDispute();

      const { result: final } = simnet.callReadOnlyFn(
        "dispute",
        "get-dispute-count",
        [],
        guest
      );
      expect(Number((final as any).value)).toBe(startCount + 1);
    });
  });

  describe("Edge Cases", () => {
    it("handles maximum length fields", () => {
      const bookingId = createBooking(host, guest);
      const longR = "A".repeat(500);
      const longE = "B".repeat(1000);

      const { result } = simnet.callPublicFn(
        "dispute",
        "raise-dispute",
        [Cl.uint(bookingId), Cl.stringUtf8(longR), Cl.stringUtf8(longE)],
        guest
      );
      expect(result).toStrictEqual(Cl.ok(Cl.uint(disputeIdNonce++)));
    });

    it("returns error for status of non-existent dispute", () => {
      const { result } = simnet.callReadOnlyFn(
        "dispute",
        "get-dispute-status",
        [Cl.uint(999)],
        guest
      );
      expect(result).toStrictEqual(Cl.none());
    });
  });
});
