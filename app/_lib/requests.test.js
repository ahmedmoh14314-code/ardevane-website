import { describe, expect, it } from "vitest";
import {
  halfHours,
  orderItems,
  orderTimes,
  orderTotal,
  requestStatusLabel,
} from "./requests";

describe("requestStatusLabel", () => {
  it("words the same lifecycle to fit each kind of request", () => {
    expect(requestStatusLabel("dining", "new")).toBe("New");
    expect(requestStatusLabel("dining", "in_progress")).toBe("Preparing");
    expect(requestStatusLabel("dining", "completed")).toBe("Delivered");
    expect(requestStatusLabel("maintenance", "completed")).toBe("Fixed");
  });
});

describe("a food order", () => {
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

describe("when food can come", () => {
  it("is every half hour", () => {
    expect(halfHours("07:00", "08:30")).toEqual([
      "07:00",
      "07:30",
      "08:00",
      "08:30",
    ]);
  });

  it("follows the sections the order has dishes from", () => {
    const menu = [
      { id: 1, course: "breakfast", price: 8 },
      { id: 2, course: "dinner", price: 30 },
    ];

    expect(orderTimes(menu, { 1: 1 }).at(0)).toBe("07:00");
    expect(orderTimes(menu, { 1: 1 }).at(-1)).toBe("11:00");
    expect(orderTimes(menu, { 2: 1 }).at(0)).toBe("18:00");
  });
});
