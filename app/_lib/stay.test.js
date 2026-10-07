import { describe, expect, it } from "vitest";
import {
  asSentence,
  canChangeOnline,
  readReview,
  reviewPath,
  takenNights,
  toISODate,
  toDay,
} from "./stay";

describe("toDay and toISODate", () => {
  it("keep a database day the same day, both ways", () => {
    const day = toDay("2026-11-02");

    expect(day.getDate()).toBe(2);
    expect(day.getHours()).toBe(0);
    expect(toISODate(day)).toBe("2026-11-02");
  });
});

describe("takenNights", () => {
  it("takes the nights of a stay, not the departure day", () => {
    const nights = takenNights([
      { start_date: "2026-11-02", end_date: "2026-11-05" },
    ]).map(toISODate);

    expect(nights).toEqual(["2026-11-02", "2026-11-03", "2026-11-04"]);
  });

  it("joins several stays", () => {
    const nights = takenNights([
      { start_date: "2026-11-02", end_date: "2026-11-03" },
      { start_date: "2026-11-10", end_date: "2026-11-12" },
    ]).map(toISODate);

    expect(nights).toEqual(["2026-11-02", "2026-11-10", "2026-11-11"]);
  });
});

describe("reviewPath and readReview", () => {
  it("carry a whole reservation through the address and back", () => {
    const path = reviewPath({
      cabinId: 32,
      from: toDay("2026-11-02"),
      to: "2026-11-05",
      guests: 2,
    });

    expect(path).toBe("/reserve?cabin=32&from=2026-11-02&to=2026-11-05&guests=2");

    const params = Object.fromEntries(new URL(path, "http://x").searchParams);
    expect(readReview(params)).toEqual({
      cabinId: 32,
      from: "2026-11-02",
      to: "2026-11-05",
      guests: 2,
    });
  });

  it("gives nothing back for a broken address", () => {
    expect(readReview({ cabin: "32", from: "2026-11-02", guests: "2" })).toBe(
      null
    );
    expect(
      readReview({ cabin: "x", from: "2026-11-02", to: "2026-11-05", guests: "2" })
    ).toBe(null);
    expect(readReview(undefined)).toBe(null);
  });
});

describe("asSentence", () => {
  it("ends a message with exactly one full stop", () => {
    expect(asSentence("Stays are at least 3 nights")).toBe("Stays are at least 3 nights.");
    expect(asSentence("Please choose other dates.")).toBe("Please choose other dates.");
  });
});

describe("canChangeOnline", () => {
  const today = "2026-11-02";

  it("allows changes until the day before arrival", () => {
    expect(canChangeOnline({ status: "reserved", startDate: "2026-11-03" }, today)).toBe(true);
    expect(canChangeOnline({ status: "reserved", startDate: "2026-11-02" }, today)).toBe(false);
  });

  it("never once the stay has started or ended", () => {
    for (const status of ["checked_in", "checked_out", "cancelled", "no_show"])
      expect(canChangeOnline({ status, startDate: "2026-12-01" }, today)).toBe(false);
  });
});
