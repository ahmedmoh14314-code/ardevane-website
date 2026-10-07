import { describe, expect, it } from "vitest";
import { orderItems, orderTotal, requestStatusLabel } from "./requests";

describe("requestStatusLabel", () => {
  it("words the same lifecycle to fit each kind of request", () => {
    expect(requestStatusLabel("breakfast", "new")).toBe("New");
    expect(requestStatusLabel("breakfast", "in_progress")).toBe("Preparing");
    expect(requestStatusLabel("breakfast", "completed")).toBe("Delivered");
    expect(requestStatusLabel("maintenance", "completed")).toBe("Fixed");
  });
});

describe("a breakfast order", () => {
  const menu = [
    { id: 1, name: "Eggs & Toast", price: 8 },
    { id: 2, name: "Coffee", price: 3 },
  ];

  it("adds up from the menu prices", () => {
    expect(orderTotal(menu, { 1: 2, 2: 1 })).toBe(19);
    expect(orderTotal(menu, {})).toBe(0);
  });

  it("sends only the dishes picked", () => {
    expect(orderItems({ 1: 2, 2: 0 })).toEqual([{ serviceId: 1, quantity: 2 }]);
  });
});
