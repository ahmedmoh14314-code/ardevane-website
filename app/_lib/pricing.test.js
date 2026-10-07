import { describe, expect, it } from "vitest";
import { formatCurrency, getBookingPrice, getNightlyPrice } from "./pricing";

const cabin = { regularPrice: 350, discount: 25 };

describe("pricing", () => {
  it("takes the discount off every night", () => {
    expect(getNightlyPrice(cabin)).toBe(325);
    expect(getNightlyPrice({ regularPrice: 250, discount: null })).toBe(250);
  });

  it("adds breakfast per guest, per night", () => {
    expect(
      getBookingPrice({
        cabin,
        numNights: 3,
        numGuests: 2,
        hasBreakfast: true,
        breakfastPrice: 15,
      })
    ).toEqual({ cabinPrice: 975, extrasPrice: 90, totalPrice: 1065 });
  });

  it("charges nothing extra without breakfast", () => {
    expect(
      getBookingPrice({
        cabin,
        numNights: 3,
        numGuests: 2,
        hasBreakfast: false,
        breakfastPrice: 15,
      }).totalPrice
    ).toBe(975);
  });

  it("shows whole dollars", () => {
    expect(formatCurrency(1065)).toBe("$1,065");
  });
});
