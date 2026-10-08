"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ReservationContext = createContext();

const initialState = { from: undefined, to: undefined };

const STORAGE_KEY = "ardevane-dates";

// Picked dates and guests survive the trip to Google and back when a guest
// signs in halfway through booking. Browser storage can be blocked, so
// every read and write is allowed to fail quietly.
function readSaved() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    const guests = Number(saved?.guests) || null;
    if (!saved?.from || !saved?.to) return { range: initialState, guests };

    return {
      range: { from: new Date(saved.from), to: new Date(saved.to) },
      guests,
    };
  } catch {
    return { range: initialState, guests: null };
  }
}

function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  // null until the guest picks a number, so each cabin can start from its own
  const [guests, setGuests] = useState(null);
  // Nothing is written back before the saved stay has been read, or the
  // empty first render would wipe it
  const [isLoaded, setIsLoaded] = useState(false);
  const resetRange = () => setRange(initialState);

  useEffect(function () {
    const saved = readSaved();
    setRange(saved.range);
    setGuests(saved.guests);
    setIsLoaded(true);
  }, []);

  useEffect(
    function () {
      if (!isLoaded) return;

      try {
        const hasRange = range?.from && range?.to;
        if (hasRange || guests)
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ...(hasRange ? range : {}), guests })
          );
        else sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
    [range, guests, isLoaded]
  );

  return (
    <ReservationContext.Provider
      value={{
        range: range ?? initialState,
        setRange,
        resetRange,
        guests,
        setGuests,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("Context was used outside provider");
  return context;
}

export { ReservationProvider, useReservation };
