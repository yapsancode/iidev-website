import { describe, expect, it } from "vitest";
import {
  BUSINESS_IDS,
  DEMO_PRESETS,
  amountOwedBy,
  amountToCollect,
  formatRM,
  getAlerts,
  reduceDemo,
  startDemo,
} from "@/components/ui/business-os-demo";

describe("business os demo", () => {
  it("moves a payment from 'to collect' to 'collected'", () => {
    const before = startDemo("service");
    const after = reduceDemo(before, { type: "pay", billId: "INV-1041" });

    expect(after.collected).toBe(before.collected + 350);
    expect(amountToCollect(after)).toBe(amountToCollect(before) - 350);
    expect(amountOwedBy(before, "Farid")).toBe(350);
    expect(amountOwedBy(after, "Farid")).toBe(0);
    expect(getAlerts(after).some((alert) => alert.tone === "red")).toBe(false);
  });

  it("ignores a payment for a bill that is already paid", () => {
    const paid = reduceDemo(startDemo("service"), { type: "pay", billId: "INV-1041" });

    expect(reduceDemo(paid, { type: "pay", billId: "INV-1041" })).toBe(paid);
  });

  it("records a counter sale and warns when the item runs low", () => {
    const before = startDemo("shop");
    const after = reduceDemo(before, { type: "sell", stockId: "cat-food" });

    expect(after.collected).toBe(before.collected + 32);
    expect(after.bills[0]).toMatchObject({ id: "S-0313", amount: 32, status: "paid" });
    expect(after.stock.find((item) => item.id === "cat-food")?.quantity).toBe(3);
    expect(after.message).toContain("low-stock alert");
    expect(getAlerts(after).find((alert) => alert.tab === "stock")?.text).toBe(
      "2 items are running low",
    );
  });

  it("never sells an item that is sold out", () => {
    let state = startDemo("shop");
    for (let sale = 0; sale < 5; sale += 1) {
      state = reduceDemo(state, { type: "sell", stockId: "cat-litter" });
    }

    expect(state.stock.find((item) => item.id === "cat-litter")?.quantity).toBe(0);
    expect(state.collected).toBe(startDemo("shop").collected + 2 * 25);
  });

  it("turns a finished job into an unpaid invoice", () => {
    const before = startDemo("service");
    const after = reduceDemo(before, { type: "finish", bookingId: "job-2" });

    expect(after.bills[0]).toMatchObject({
      id: "INV-1044",
      customer: "Mr Tan",
      amount: 250,
      status: "unpaid",
    });
    expect(amountToCollect(after)).toBe(amountToCollect(before) + 250);
    expect(after.collected).toBe(before.collected);
    expect(getAlerts(after).find((alert) => alert.tab === "bookings")?.text).toBe(
      "2 jobs still to do today",
    );
  });

  it("takes stock out when a quotation becomes an invoice", () => {
    const before = startDemo("supplier");
    const after = reduceDemo(before, { type: "invoice", billId: "Q-208" });

    expect(after.bills.find((bill) => bill.customer === "Mr Lim")).toMatchObject({
      id: "INV-0521",
      status: "unpaid",
    });
    expect(after.stock.find((item) => item.id === "boxes")?.quantity).toBe(4);
    expect(amountToCollect(after)).toBe(amountToCollect(before) + 1200);
    expect(getAlerts(after).find((alert) => alert.tab === "stock")?.text).toBe(
      "2 items are running low",
    );
  });

  it("clears a low-stock alert after a restock", () => {
    const after = reduceDemo(startDemo("supplier"), { type: "restock", stockId: "bags" });

    expect(getAlerts(after).some((alert) => alert.tab === "stock")).toBe(false);
  });

  it("goes back to the starting data on reset", () => {
    const changed = reduceDemo(startDemo("shop"), { type: "sell", stockId: "treats" });

    expect(reduceDemo(changed, { type: "reset", business: "shop" })).toEqual(startDemo("shop"));
  });

  it("gives every tab something to show", () => {
    for (const business of BUSINESS_IDS) {
      const { tabs, start, customers } = DEMO_PRESETS[business];
      const ids = tabs.map((tab) => tab.id);

      expect(ids).toHaveLength(4);
      expect(ids[0]).toBe("today");
      expect(customers.length).toBeGreaterThan(0);
      expect(start.bills.length).toBeGreaterThan(0);
      expect(ids.includes("stock")).toBe(start.stock.length > 0);
      expect(ids.includes("bookings")).toBe(start.bookings.length > 0);
    }
  });

  it("only lists customers who have a bill, so balances can be shown", () => {
    for (const business of BUSINESS_IDS) {
      const { customers, start } = DEMO_PRESETS[business];
      const names = customers.map((customer) => customer.name);

      for (const bill of start.bills) expect(names).toContain(bill.customer);
      for (const booking of start.bookings) expect(names).toContain(booking.customer);
    }
  });

  // MyInvois is "coming soon" on the price list, so the sample must not show it.
  it("does not show e-invoicing", () => {
    expect(JSON.stringify(DEMO_PRESETS)).not.toMatch(/myinvois|e-?invoic|lhdn/i);
  });

  it("formats ringgit with thousands separators", () => {
    expect(formatRM(36)).toBe("RM 36");
    expect(formatRM(1240)).toBe("RM 1,240");
    expect(formatRM(12400)).toBe("RM 12,400");
  });
});
