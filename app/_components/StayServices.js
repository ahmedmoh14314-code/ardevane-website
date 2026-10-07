"use client";

import { useState, useTransition } from "react";
import {
  LifebuoyIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  SunIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { createStayRequest } from "../_lib/actions";
import { formatCurrency } from "../_lib/pricing";
import {
  BREAKFAST_TIMES,
  HOUSEKEEPING_CHOICES,
  ISSUE_CHOICES,
  orderItems,
  orderTotal,
} from "../_lib/requests";

const tiles = [
  {
    key: "breakfast",
    label: "Menu / Breakfast",
    hint: "Brought to your cabin",
    icon: SunIcon,
  },
  {
    key: "housekeeping",
    label: "Housekeeping",
    hint: "Towels, cleaning, linen",
    icon: SparklesIcon,
  },
  {
    key: "support",
    label: "Need help",
    hint: "Ask the front desk",
    icon: LifebuoyIcon,
  },
  {
    key: "maintenance",
    label: "Report an issue",
    hint: "Something not working",
    icon: WrenchScrewdriverIcon,
  },
];

const field =
  "w-full rounded-xl border border-cream-200 bg-cream-50 px-4 py-2.5 text-ink-800 placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-cream-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700"
      }`}
    >
      {children}
    </button>
  );
}

function Label({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-500"
    >
      {children}
    </label>
  );
}

// What a checked-in guest can ask the hotel for. Each request goes to the
// front desk; its progress shows in "Your requests" below.
function StayServices({ menu }) {
  const [open, setOpen] = useState(null);
  const [sent, setSent] = useState(null);

  function choose(key) {
    setSent(null);
    setOpen((current) => (current === key ? null : key));
  }

  function done(message) {
    setOpen(null);
    setSent(message);
  }

  return (
    <section className="card p-6 sm:p-8">
      <p className="eyebrow mb-1">During your stay</p>
      <h2 className="mb-6 font-display text-2xl text-brand-900">
        What can we bring you?
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map(({ key, label, hint, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => choose(key)}
            aria-expanded={open === key}
            className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
              open === key
                ? "border-brand-600 bg-brand-50 shadow-soft"
                : "border-cream-200 bg-white hover:border-brand-300 hover:shadow-soft"
            }`}
          >
            <Icon className="h-6 w-6 text-gold-600" />
            <span className="font-semibold text-ink-800">{label}</span>
            <span className="text-xs text-ink-500">{hint}</span>
          </button>
        ))}
      </div>

      {sent && (
        <p className="mt-6 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          {sent}
        </p>
      )}

      {open === "breakfast" && <BreakfastForm menu={menu} onDone={done} />}
      {open === "housekeeping" && (
        <ChoiceForm
          type="housekeeping"
          choices={HOUSEKEEPING_CHOICES}
          question="What do you need?"
          notePlaceholder="Anything we should know? (optional)"
          onDone={done}
        />
      )}
      {open === "support" && <HelpForm onDone={done} />}
      {open === "maintenance" && (
        <ChoiceForm
          type="maintenance"
          choices={ISSUE_CHOICES}
          question="What isn't working?"
          notePlaceholder="Tell us a little more (optional)"
          withUrgency
          onDone={done}
        />
      )}
    </section>
  );
}

// Sends a request and reports back. Shared by every form below.
function useSend(onDone) {
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  function send(request, message) {
    setError(null);
    startTransition(async () => {
      const result = await createStayRequest(request);
      if (result?.error) setError(result.error);
      else onDone(message);
    });
  }

  return { send, error, isPending };
}

function FormShell({
  onSubmit,
  error,
  isPending,
  submitLabel,
  disabled,
  children,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mt-6 space-y-5 border-t border-cream-200 pt-6"
    >
      {children}

      {error && (
        <p className="rounded-xl bg-[#f8e2da] px-4 py-3 text-sm text-[#9b3b23]">
          {error}
        </p>
      )}

      <button
        className="btn-primary w-full sm:w-auto"
        disabled={disabled || isPending}
      >
        {isPending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

function BreakfastForm({ menu, onDone }) {
  const [quantities, setQuantities] = useState({});
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const { send, error, isPending } = useSend(onDone);

  const total = orderTotal(menu, quantities);
  const items = orderItems(quantities);

  const change = (id, by) =>
    setQuantities((current) => ({
      ...current,
      [id]: Math.min(Math.max((current[id] ?? 0) + by, 0), 20),
    }));

  return (
    <FormShell
      onSubmit={() =>
        send(
          { type: "breakfast", requestedFor: time, note, items },
          "Your breakfast order is with the kitchen."
        )
      }
      error={error}
      isPending={isPending}
      disabled={!items.length}
      submitLabel={
        items.length ? `Order for ${formatCurrency(total)}` : "Choose something"
      }
    >
      <ul className="divide-y divide-cream-100">
        {menu.map((item) => {
          const quantity = quantities[item.id] ?? 0;

          return (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="font-medium text-ink-800">{item.name}</p>
                <p className="text-sm text-ink-500">
                  {formatCurrency(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => change(item.id, -1)}
                  disabled={!quantity}
                  aria-label={`One less ${item.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-200 text-ink-600 transition-colors hover:border-brand-300 disabled:opacity-40"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-5 text-center font-semibold tabular-nums text-ink-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => change(item.id, 1)}
                  aria-label={`One more ${item.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-600 bg-brand-600 text-white transition-colors hover:bg-brand-700"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
        <div>
          <Label htmlFor="breakfast-time">When</Label>
          <select
            id="breakfast-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={field}
          >
            <option value="">As soon as possible</option>
            {BREAKFAST_TIMES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="breakfast-note">Note</Label>
          <input
            id="breakfast-note"
            value={note}
            maxLength={1000}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Allergies, how you like your eggs… (optional)"
            className={field}
          />
        </div>
      </div>

      <p className="text-sm text-ink-500">
        Added to your stay charges when it is delivered.
      </p>
    </FormShell>
  );
}

function ChoiceForm({
  type,
  choices,
  question,
  notePlaceholder,
  withUrgency,
  onDone,
}) {
  const [choice, setChoice] = useState(null);
  const [note, setNote] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const { send, error, isPending } = useSend(onDone);

  return (
    <FormShell
      onSubmit={() =>
        send(
          {
            type,
            title: choice,
            note,
            priority: isUrgent ? "urgent" : "normal",
          },
          `"${choice}" is with the front desk. You'll see its progress below.`
        )
      }
      error={error}
      isPending={isPending}
      disabled={!choice}
      submitLabel="Send request"
    >
      <div>
        <Label>{question}</Label>
        <div className="flex flex-wrap gap-2">
          {choices.map((value) => (
            <Chip
              key={value}
              active={choice === value}
              onClick={() => setChoice(value)}
            >
              {value}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor={`${type}-note`}>Details</Label>
        <textarea
          id={`${type}-note`}
          rows={3}
          value={note}
          maxLength={1000}
          onChange={(e) => setNote(e.target.value)}
          placeholder={notePlaceholder}
          className={field}
        />
      </div>

      {withUrgency && (
        <label className="flex items-center gap-3 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="h-4 w-4 accent-[#9b3b23]"
          />
          It&rsquo;s urgent, it can&rsquo;t wait
        </label>
      )}
    </FormShell>
  );
}

function HelpForm({ onDone }) {
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const { send, error, isPending } = useSend(onDone);

  return (
    <FormShell
      onSubmit={() =>
        send(
          { type: "support", title: subject.trim(), note },
          "The front desk has your message. You'll see its progress below."
        )
      }
      error={error}
      isPending={isPending}
      disabled={!subject.trim()}
      submitLabel="Send to the front desk"
    >
      <div>
        <Label htmlFor="help-subject">Subject</Label>
        <input
          id="help-subject"
          value={subject}
          maxLength={120}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Late checkout, extra pillows, directions…"
          className={field}
        />
      </div>
      <div>
        <Label htmlFor="help-note">Message</Label>
        <textarea
          id="help-note"
          rows={3}
          value={note}
          maxLength={1000}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How can we help? (optional)"
          className={field}
        />
      </div>
    </FormShell>
  );
}

export default StayServices;
