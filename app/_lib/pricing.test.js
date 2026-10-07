import { describe, expect, it } from "vitest";
import { formatCurrency, getNightlyPrice, getStayPrice } from "./pricing";

const cabin = { regularPrice: 350, discount: 25 };

describe("pricing", () => {
  it("takes the discount off every night", () => {
    expect(getNightlyPrice(cabin)).toBe(325);
    expect(getNightlyPrice({ regularPrice: 250, discount: null })).toBe(250);
  });

  it("prices a stay by its nights", () => {
    expect(getStayPrice(cabin, 3)).toBe(975);
  });

  it("shows whole dollars", () => {
    expect(formatCurrency(1065)).toBe("$1,065");
  });
});
