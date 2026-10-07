"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ReservationContext = createContext();

const initialState = { from: undefined, to: undefined };

const STORAGE_KEY = "ardevane-dates";

// Picked dates survive the trip to Google and back when a guest signs in
// halfway through booking. Browser storage can be blocked, so every read
// and write is allowed to fail quietly.
function readSavedRange() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!saved?.from || !saved?.to) return initialState;

    return { from: new Date(saved.from), to: new Date(saved.to) };
  } catch {
    return initialState;
  }
}

function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);

  useEffect(function () {
    setRange(readSavedRange());
  }, []);

  useEffect(
    function () {
      try {
        if (range?.from && range?.to)
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(range));
        else sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
    [range]
  );

  return (
    <ReservationContext.Provider
      value={{ range: range ?? initialState, setRange, resetRange }}
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
