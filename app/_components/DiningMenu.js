"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { createStayRequest } from "../_lib/actions";
import { formatCurrency } from "../_lib/pricing";
import { COURSES, orderItems, orderTimes, orderTotal } from "../_lib/requests";

// A soft colour per section, for dishes that don't have a photo yet
const placeholders = {
  breakfast: "from-[#f6ecd9] to-[#ecd8b0]",
  lunch: "from-[#e2efe6] to-[#b2d6c6]",
  dinner: "from-[#3b4b44] to-[#0e3326]",
  desserts: "from-[#f8e2da] to-[#ecc2b4]",
  drinks: "from-[#e3eef1] to-[#b9d3db]",
};

function DishPhoto({ dish }) {
  if (dish.image)
    return (
      <Image
        src={dish.image}
        alt={dish.name}
        fill
        sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${placeholders[dish.course]}`}
    >
      <span
        className={`font-display text-5xl ${
          dish.course === "dinner" ? "text-white/80" : "text-forest-950/40"
        }`}
      >
        {dish.name.charAt(0)}
      </span>
    </div>
  );
}

function Stepper({ dish, quantity, onChange }) {
  if (!quantity)
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        className="rounded-full bg-forest-900 px-5 py-1.5 font-display text-[0.95rem] text-sand-50 transition-colors hover:bg-forest-700"
        aria-label={`Add ${dish.name}`}
      >
        Add
      </button>
    );

  return (
    <div className="flex items-center gap-2 rounded-full bg-sand-200/70 p-1">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={`One less ${dish.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-700 shadow-sm"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="w-5 text-center font-semibold tabular-nums text-forest-950">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label={`One more ${dish.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-900 text-sand-50"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

// The dining menu: pick dishes from any section, then a day and a time,
// and it is brought to the cabin. Charged to the stay when delivered.
function DiningMenu({ menu, days, isStaying }) {
  const sections = COURSES.filter((course) =>
    menu.some((dish) => dish.course === course.key)
  );

  const [section, setSection] = useState(sections[0]?.key);
  const [quantities, setQuantities] = useState({});
  const [day, setDay] = useState(days[0] ?? "");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [placed, setPlaced] = useState(null);
  const [isPending, startTransition] = useTransition();

  const items = orderItems(quantities);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = orderTotal(menu, quantities);
  const times = orderTimes(menu, quantities);

  const setQuantity = (id, value) => {
    setPlaced(null);
    setQuantities((current) => ({
      ...current,
      [id]: Math.min(Math.max(value, 0), 20),
    }));
  };

  function placeOrder() {
    setError(null);
    startTransition(async () => {
      const result = await createStayRequest({
        type: "dining",
        requestedDate: day,
        requestedFor: time,
        note,
        items,
      });

      if (result?.error) return setError(result.error);

      setPlaced(
        `Your order is with the kitchen: ${count} ${count === 1 ? "item" : "items"}, ${formatCurrency(total)}.`
      );
      setQuantities({});
      setNote("");
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div>
        {/* The sections, as tabs that stay in view */}
        <div className="sticky top-[4.5rem] z-10 -mx-1 mb-6 flex gap-2 overflow-x-auto bg-sand-50/95 px-1 py-2 backdrop-blur">
          {sections.map(({ key, label }) => {
            const inSection = menu
              .filter((dish) => dish.course === key)
              .reduce((sum, dish) => sum + (quantities[dish.id] ?? 0), 0);

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key)}
                aria-pressed={section === key}
                className={`flex min-h-[2.75rem] items-center gap-2 whitespace-nowrap rounded-full border px-5 font-display text-[1rem] transition-colors ${
                  section === key
                    ? "border-forest-900 bg-forest-900 text-sand-50"
                    : "border-sand-300 bg-transparent text-ink-700 hover:border-forest-700 hover:text-forest-900"
                }`}
              >
                {label}
                {inSection > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 font-label text-xs ${
                      section === key
                        ? "bg-white/20"
                        : "bg-sand-200 text-forest-900"
                    }`}
                  >
                    {inSection}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <ul className="grid gap-5 sm:grid-cols-2">
          {menu
            .filter((dish) => dish.course === section)
            .map((dish) => (
              <li
                key={dish.id}
                className="card group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <DishPhoto dish={dish} />
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-ink-800">{dish.name}</h3>
                    <span className="whitespace-nowrap font-semibold text-forest-900">
                      {formatCurrency(dish.price)}
                    </span>
                  </div>
                  {dish.description && (
                    <p className="text-sm text-ink-500">{dish.description}</p>
                  )}
                  <div className="mt-auto flex justify-end pt-2">
                    <Stepper
                      dish={dish}
                      quantity={quantities[dish.id] ?? 0}
                      onChange={(value) => setQuantity(dish.id, value)}
                    />
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* The order, beside the menu on wide screens, under it on phones */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card space-y-4 p-6">
          <p className="eyebrow">Your order</p>

          {count ? (
            <ul className="space-y-1.5 text-sm">
              {menu
                .filter((dish) => quantities[dish.id] > 0)
                .map((dish) => (
                  <li key={dish.id} className="flex justify-between gap-3">
                    <span className="text-ink-700">
                      {dish.name}{" "}
                      <span className="text-ink-400">
                        × {quantities[dish.id]}
                      </span>
                    </span>
                    <span className="tabular-nums text-ink-600">
                      {formatCurrency(dish.price * quantities[dish.id])}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-500">
              Nothing yet. Add dishes from any section.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Day
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="field mt-1 py-2 text-sm normal-case tracking-normal"
              >
                {days.map((value) => (
                  <option key={value} value={value}>
                    {format(parseISO(value), "EEE, MMM d")}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Time
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="field mt-1 py-2 text-sm normal-case tracking-normal"
              >
                <option value="">{isStaying ? "Soonest" : "Any time"}</option>
                {times.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <input
            value={note}
            maxLength={1000}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Allergies or anything else? (optional)"
            className="field py-2 text-sm"
          />

          {error && (
            <p className="rounded-md bg-[#f8e2da] px-4 py-3 font-label text-sm text-[#9b3b23]">
              {error}
            </p>
          )}
          {placed && (
            <p className="rounded-md bg-sand-200/70 px-4 py-3 text-sm font-medium text-forest-900">
              {placed}{" "}
              <Link href="/my-stay" className="underline">
                Follow it in My Stay
              </Link>
            </p>
          )}

          <button
            type="button"
            onClick={placeOrder}
            disabled={!count || isPending}
            className="btn-primary w-full"
          >
            {isPending
              ? "Sending…"
              : count
                ? `Order · ${formatCurrency(total)}`
                : "Add something to order"}
          </button>

          <p className="text-center text-xs text-ink-500">
            Brought to your cabin. Added to your stay charges when delivered.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default DiningMenu;
