import { describe, expect, it } from "vitest";
import { sortBookings, stayDay } from "./account";

const today = "2026-11-05";

const booking = (id, status, startDate, endDate) => ({
  id,
  status,
  startDate,
  endDate,
});

describe("sortBookings", () => {
  it("is 'none' with no bookings, or only past ones", () => {
    expect(sortBookings([], today).state).toBe("none");

    const { state, history } = sortBookings(
      [booking(1, "checked_out", "2026-10-01", "2026-10-04")],
      today
    );
    expect(state).toBe("none");
    expect(history.map((b) => b.id)).toEqual([1]);
  });

  it("is 'upcoming' with a reservation ahead, soonest first", () => {
    const { state, upcoming } = sortBookings(
      [
        booking(1, "reserved", "2026-12-10", "2026-12-14"),
        booking(2, "reserved", "2026-11-20", "2026-11-23"),
      ],
      today
    );

    expect(state).toBe("upcoming");
    expect(upcoming.map((b) => b.id)).toEqual([2, 1]);
  });

  it("is 'staying' once checked in, with other bookings kept apart", () => {
    const { state, stay, upcoming, history } = sortBookings(
      [
        booking(1, "checked_out", "2026-09-01", "2026-09-04"),
        booking(2, "checked_in", "2026-11-03", "2026-11-08"),
        booking(3, "reserved", "2026-12-01", "2026-12-04"),
        booking(4, "cancelled", "2026-10-01", "2026-10-03"),
      ],
      today
    );

    expect(state).toBe("staying");
    expect(stay.id).toBe(2);
    expect(upcoming.map((b) => b.id)).toEqual([3]);
    expect(history.map((b) => b.id)).toEqual([4, 1]);
  });

  it("moves a checked-out stay to history", () => {
    const { state, stay, history } = sortBookings(
      [booking(2, "checked_out", "2026-11-03", "2026-11-05")],
      today
    );

    expect(state).toBe("none");
    expect(stay).toBe(null);
    expect(history.map((b) => b.id)).toEqual([2]);
  });
});

describe("asking for things before arrival", () => {
  it("is for the stay now, or else the next confirmed booking", () => {
    const { servicesFor, upcoming } = sortBookings(
      [
        booking(1, "pending", "2026-11-10", "2026-11-13"),
        booking(2, "reserved", "2026-11-20", "2026-11-23"),
      ],
      today
    );

    // A request still waiting for the hotel is upcoming, but has no services
    expect(upcoming.map((b) => b.id)).toEqual([1, 2]);
    expect(servicesFor.id).toBe(2);
  });

  it("has nothing to offer with only a request waiting", () => {
    const { state, servicesFor } = sortBookings(
      [booking(1, "pending", "2026-11-10", "2026-11-13")],
      today
    );

    expect(state).toBe("upcoming");
    expect(servicesFor).toBe(null);
  });
});

describe("stayDay", () => {
  const stay = { startDate: "2026-11-03", endDate: "2026-11-08", numNights: 5 };

  it("counts the arrival day as day 1", () => {
    expect(stayDay(stay, "2026-11-03")).toEqual({
      day: 1,
      of: 5,
      isDepartureDay: false,
    });
    expect(stayDay(stay, "2026-11-05").day).toBe(3);
    expect(stayDay(stay, "2026-11-07").day).toBe(5);
  });

  it("knows the departure day", () => {
    expect(stayDay(stay, "2026-11-08")).toEqual({
      day: 5,
      of: 5,
      isDepartureDay: true,
    });
  });
});
