"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { createStayRequest } from "../_lib/actions";
import { formatCurrency } from "../_lib/pricing";
import { COURSES, orderItems, orderTimes, orderTotal } from "../_lib/requests";

function DishPhoto({ dish }) {
  if (dish.image)
    return (
      <Image
        src={dish.image}
        alt={dish.name}
        fill
        sizes="7rem"
        className="object-cover"
      />
    );

  return (
    <div className="flex h-full w-full items-center justify-center bg-sand-200 font-display text-3xl text-forest-950/40">
      {dish.name.charAt(0)}
    </div>
  );
}

// "Add", then a minus, the count, and a plus
function Stepper({ dish, quantity, onChange }) {
  if (!quantity)
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        className="btn-outline min-h-[2.5rem] px-5 text-[0.98rem]"
        aria-label={`Add ${dish.name}`}
      >
        Add
      </button>
    );

  const round =
    "flex h-10 w-10 items-center justify-center rounded-full font-display text-xl leading-none";

  return (
    <div className="flex items-center gap-1 rounded-full border border-forest-900 bg-white">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={`One less ${dish.name}`}
        className={`${round} text-forest-900`}
      >
        &minus;
      </button>
      <span className="w-5 text-center font-display text-[1.05rem] tabular-nums text-forest-950">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label={`One more ${dish.name}`}
        className={`${round} text-forest-900`}
      >
        +
      </button>
    </div>
  );
}

// The order itself: what was picked, when it should come, and the button
function OrderPanel({
  menu,
  quantities,
  count,
  total,
  times,
  days,
  day,
  setDay,
  time,
  setTime,
  note,
  setNote,
  error,
  placed,
  isPending,
  isStaying,
  onOrder,
}) {
  const selectClass = "field mt-1.5 py-2.5 font-display text-[1.02rem]";

  return (
    <div className="space-y-5">
      {count ? (
        <ul className="divide-y divide-sand-200 border-y border-sand-200 font-display text-[1.02rem]">
          {menu
            .filter((dish) => quantities[dish.id] > 0)
            .map((dish) => (
              <li
                key={dish.id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <span className="text-ink-800">
                  {dish.name}
                  <span className="ml-2 text-ink-500">
                    &times; {quantities[dish.id]}
                  </span>
                </span>
                <span className="tabular-nums text-ink-700">
                  {formatCurrency(dish.price * quantities[dish.id])}
                </span>
              </li>
            ))}
          <li className="flex items-center justify-between py-2.5 text-[1.15rem] text-forest-950">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(total)}</span>
          </li>
        </ul>
      ) : (
        <p className="font-display text-[1.02rem] text-ink-600">
          Nothing picked yet. Tap Add next to a dish.
        </p>
      )}

      <div className="grid gap-3">
        <label className="font-display text-[1.02rem] text-forest-950">
          Which day
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={selectClass}
          >
            {days.map((value) => (
              <option key={value} value={value}>
                {format(parseISO(value), "EEE, MMM d")}
              </option>
            ))}
          </select>
        </label>
        <label className="font-display text-[1.02rem] text-forest-950">
          What time
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={selectClass}
          >
            <option value="">
              {isStaying ? "As soon as possible" : "Any time"}
            </option>
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
        className="field font-display text-[1.02rem]"
      />

      {error && (
        <p className="rounded-[3px] bg-[#f8e2da] px-4 py-3 font-label text-sm text-[#9b3b23]">
          {error}
        </p>
      )}
      {placed && (
        <p className="rounded-[3px] bg-[#e2efe6] px-4 py-3 font-display text-[1.02rem] text-[#1d5a3d]">
          {placed}{" "}
          <Link href="/my-stay" className="underline underline-offset-4">
            Follow it in My Stay
          </Link>
        </p>
      )}

      <button
        type="button"
        onClick={onOrder}
        disabled={!count || isPending}
        className="btn-forest w-full"
      >
        {isPending
          ? "Sending…"
          : count
            ? `Send order · ${formatCurrency(total)}`
            : "Send order"}
      </button>

      <p className="text-center font-label text-[0.8rem] leading-relaxed text-ink-500">
        Brought to your cabin. Added to your charges when delivered.
      </p>
    </div>
  );
}

// The dining menu: pick dishes from any section, then a day and a time,
// and it is brought to the cabin. On phones the order waits in a bar at
// the bottom and opens when you are ready; on wide screens it sits beside
// the menu.
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
  const [isReviewing, setIsReviewing] = useState(false);

  const items = orderItems(quantities);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = orderTotal(menu, quantities);
  const times = orderTimes(menu, quantities);

  // The sheet on phones keeps the page from scrolling under it
  useEffect(() => {
    document.body.style.overflow = isReviewing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isReviewing]);

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

  const panel = (
    <OrderPanel
      {...{
        menu,
        quantities,
        count,
        total,
        times,
        days,
        day,
        setDay,
        time,
        setTime,
        note,
        setNote,
        error,
        placed,
        isPending,
        isStaying,
      }}
      onOrder={placeOrder}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        {/* The sections, as a row that stays in view */}
        <div className="sticky top-16 z-10 -mx-4 mb-4 flex gap-2.5 overflow-x-auto bg-sand-50/95 px-4 py-3 backdrop-blur sm:-mx-0 sm:px-0 md:top-[4.5rem]">
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
                className={`pill ${section === key ? "pill-on" : "pill-off"}`}
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

        {/* The dishes, one a row: photo, name and price, and Add */}
        <ul className="divide-y divide-sand-200 border-y border-sand-200 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:divide-y-0 lg:border-0">
          {menu
            .filter((dish) => dish.course === section)
            .map((dish) => (
              <li
                key={dish.id}
                className="flex items-center gap-4 py-4 lg:border-b lg:border-sand-200"
              >
                <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-[3px] sm:h-24 sm:w-28">
                  <DishPhoto dish={dish} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[1.15rem] leading-tight text-forest-950">
                    {dish.name}
                  </h3>
                  {dish.description && (
                    <p className="mt-0.5 line-clamp-2 font-label text-[0.82rem] leading-snug text-ink-600">
                      {dish.description}
                    </p>
                  )}
                  <p className="mt-1 font-display text-[1.05rem] text-bark-700">
                    {formatCurrency(dish.price)}
                  </p>
                </div>

                <Stepper
                  dish={dish}
                  quantity={quantities[dish.id] ?? 0}
                  onChange={(value) => setQuantity(dish.id, value)}
                />
              </li>
            ))}
        </ul>
      </div>

      {/* Wide screens: the order beside the menu */}
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <div className="rounded-md border border-sand-200 bg-sand-50 p-6 shadow-soft">
          <h2 className="mb-4 font-display text-[1.6rem] text-forest-950">
            Your order
          </h2>
          {panel}
        </div>
      </aside>

      {/* Phones: a bar at the bottom, and the order as a sheet over the page */}
      {(count > 0 || placed) && !isReviewing && (
        <div className="fixed inset-x-0 bottom-[3.4rem] z-30 border-t border-sand-200 bg-sand-50/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setIsReviewing(true)}
            className="btn-forest w-full justify-between px-5"
          >
            <span>
              {count
                ? `${count} ${count === 1 ? "item" : "items"} picked`
                : "Order sent"}
            </span>
            <span>
              {count ? `Review order · ${formatCurrency(total)}` : "See it"}
            </span>
          </button>
        </div>
      )}

      {isReviewing && (
        <div className="fixed inset-0 z-40 flex items-end lg:hidden">
          <button
            aria-label="Close"
            onClick={() => setIsReviewing(false)}
            className="absolute inset-0 animate-fade bg-forest-950/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            className="relative max-h-[88vh] w-full animate-rise overflow-y-auto rounded-t-md bg-sand-50 p-5 shadow-lift"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="font-display text-[1.7rem] leading-tight text-forest-950">
                Your order
              </h2>
              <button
                onClick={() => setIsReviewing(false)}
                className="font-display text-[1.02rem] text-ink-600 underline underline-offset-4"
              >
                Back to menu
              </button>
            </div>
            {panel}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiningMenu;
