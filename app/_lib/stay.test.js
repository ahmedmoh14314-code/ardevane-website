import { describe, expect, it } from "vitest";
import {
  asSentence,
  canChangeOnline,
  nextRange,
  pickableRange,
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

    expect(path).toBe(
      "/reserve?cabin=32&from=2026-11-02&to=2026-11-05&guests=2"
    );

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
      readReview({
        cabin: "x",
        from: "2026-11-02",
        to: "2026-11-05",
        guests: "2",
      })
    ).toBe(null);
    expect(readReview(undefined)).toBe(null);
  });
});

describe("asSentence", () => {
  it("ends a message with exactly one full stop", () => {
    expect(asSentence("Stays are at least 3 nights")).toBe(
      "Stays are at least 3 nights."
    );
    expect(asSentence("Please choose other dates.")).toBe(
      "Please choose other dates."
    );
  });
});

describe("canChangeOnline", () => {
  const today = "2026-11-02";

  it("allows changing a request still waiting for the hotel", () => {
    expect(
      canChangeOnline({ status: "pending", startDate: "2026-11-03" }, today)
    ).toBe(true);
  });

  it("allows changes until the day before arrival", () => {
    expect(
      canChangeOnline({ status: "reserved", startDate: "2026-11-03" }, today)
    ).toBe(true);
    expect(
      canChangeOnline({ status: "reserved", startDate: "2026-11-02" }, today)
    ).toBe(false);
  });

  it("never once the stay has started or ended", () => {
    for (const status of ["checked_in", "checked_out", "cancelled", "no_show"])
      expect(canChangeOnline({ status, startDate: "2026-12-01" }, today)).toBe(
        false
      );
  });
});

describe("pickableRange", () => {
  const taken = takenNights([
    { start_date: "2026-10-15", end_date: "2026-10-20" },
  ]);
  const rules = { minBookingLength: 3, maxBookingLength: 90 };
  const stay = (from, to) => ({ from: toDay(from), to: toDay(to) });

  it("keeps a stay with free nights only", () => {
    const range = stay("2026-10-10", "2026-10-15");
    expect(pickableRange(range, taken, rules)).toBe(range);
  });

  it("drops a stay that runs over a taken night", () => {
    expect(
      pickableRange(stay("2026-10-13", "2026-10-28"), taken, rules)
    ).toEqual({});
  });

  it("allows arriving on the morning the last guest leaves", () => {
    const range = stay("2026-10-20", "2026-10-25");
    expect(pickableRange(range, taken, rules)).toBe(range);
  });

  it("drops a stay shorter or longer than the rules", () => {
    expect(
      pickableRange(stay("2026-10-01", "2026-10-03"), taken, rules)
    ).toEqual({});
    expect(
      pickableRange(stay("2026-11-01", "2027-03-01"), taken, rules)
    ).toEqual({});
  });

  it("drops half a stay", () => {
    expect(pickableRange({ from: toDay("2026-10-01") }, taken, rules)).toEqual(
      {}
    );
  });
});

describe("nextRange", () => {
  const rules = { minBookingLength: 3, maxBookingLength: 90 };
  const taken = takenNights([
    { start_date: "2026-10-15", end_date: "2026-10-20" },
  ]);
  const day = toDay;

  it("starts a stay on the first click", () => {
    expect(nextRange({}, day("2026-10-05"), taken, rules)).toEqual({
      from: day("2026-10-05"),
      to: undefined,
    });
  });

  it("ends the stay on the second click", () => {
    expect(
      nextRange({ from: day("2026-10-05") }, day("2026-10-10"), taken, rules)
    ).toEqual({ from: day("2026-10-05"), to: day("2026-10-10") });
  });

  it("starts again when a whole stay is already picked", () => {
    expect(
      nextRange(
        { from: day("2026-10-05"), to: day("2026-10-10") },
        day("2026-10-22"),
        taken
      )
    ).toEqual({ from: day("2026-10-22"), to: undefined });
  });

  it("starts again from a day before the arrival", () => {
    expect(
      nextRange({ from: day("2026-10-10") }, day("2026-10-02"), taken, rules)
    ).toEqual({ from: day("2026-10-02"), to: undefined });
  });

  it("starts again instead of jumping over taken nights", () => {
    expect(
      nextRange({ from: day("2026-10-13") }, day("2026-10-28"), taken, rules)
    ).toEqual({ from: day("2026-10-28"), to: undefined });
  });

  it("starts again past the longest stay", () => {
    expect(
      nextRange({ from: day("2026-10-21") }, day("2027-03-01"), taken, rules)
    ).toEqual({ from: day("2027-03-01"), to: undefined });
  });

  it("clears the arrival when it is clicked again", () => {
    expect(
      nextRange({ from: day("2026-10-05") }, day("2026-10-05"), taken, rules)
    ).toEqual({});
  });
});
