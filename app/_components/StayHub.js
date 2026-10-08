"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

import diningPhoto from "@/public/img/stay/breakfast.jpg";
import housekeepingPhoto from "@/public/img/stay/housekeeping.jpg";
import helpPhoto from "@/public/img/stay/help.jpg";
import maintenancePhoto from "@/public/img/stay/maintenance.jpg";
import cabinRequestsPhoto from "@/public/img/stay/cabin-requests.jpg";
import stayChargesPhoto from "@/public/img/stay/stay-charges.jpg";

import StayFolio from "./StayFolio";
import { createStayRequest } from "../_lib/actions";
import {
  CABIN_ITEMS,
  HOUSEKEEPING_CHOICES,
  ISSUE_CHOICES,
} from "../_lib/requests";

// The six things a guest can do from My Stay: a photo and a few words each
const services = [
  {
    key: "dining",
    title: "Food & drinks",
    text: "Breakfast, lunch and dinner to your cabin",
    photo: diningPhoto,
    href: "/my-stay/menu",
  },
  {
    key: "housekeeping",
    title: "Housekeeping",
    text: "Towels, linen and cleaning",
    photo: housekeepingPhoto,
  },
  {
    key: "cabin",
    title: "For the cabin",
    text: "Pillows, firewood, a cot",
    photo: cabinRequestsPhoto,
  },
  {
    key: "maintenance",
    title: "Something broken?",
    text: "Tell us and we fix it",
    photo: maintenancePhoto,
  },
  {
    key: "support",
    title: "Ask us anything",
    text: "A message to our team",
    photo: helpPhoto,
  },
  {
    key: "charges",
    title: "Your charges",
    text: "What your stay costs so far",
    photo: stayChargesPhoto,
  },
];

const field =
  "w-full rounded-[3px] border border-sand-300 bg-white px-4 py-3 font-display text-[1.02rem] text-ink-800 placeholder:text-ink-400 focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-sand-200";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pill ${active ? "pill-on" : "pill-off"}`}
    >
      {children}
    </button>
  );
}

function Label({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-display text-[1.1rem] text-forest-950"
    >
      {children}
    </label>
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
      className="space-y-5"
    >
      {children}

      {error && (
        <p className="rounded-[3px] bg-[#f8e2da] px-4 py-3 font-label text-sm text-[#9b3b23]">
          {error}
        </p>
      )}

      <button className="btn-forest w-full" disabled={disabled || isPending}>
        {isPending ? "Sending…" : submitLabel}
      </button>
    </form>
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
          `"${choice}" is with the front desk. You'll see it below as it moves on.`
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
        <Label htmlFor={`${type}-note`}>Anything else? (optional)</Label>
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
        <label className="flex items-center gap-3 font-display text-[1.02rem] text-ink-700">
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="h-5 w-5 accent-[#9b3b23]"
          />
          It&rsquo;s urgent
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
          "Our team has your message. You'll see it below as it moves on."
        )
      }
      error={error}
      isPending={isPending}
      disabled={!subject.trim()}
      submitLabel="Send message"
    >
      <div>
        <Label htmlFor="help-subject">What is it about?</Label>
        <input
          id="help-subject"
          value={subject}
          maxLength={120}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Late checkout, directions, anything…"
          className={field}
        />
      </div>
      <div>
        <Label htmlFor="help-note">Your message (optional)</Label>
        <textarea
          id="help-note"
          rows={4}
          value={note}
          maxLength={1000}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How can we help?"
          className={field}
        />
      </div>
    </FormShell>
  );
}

// A calm panel over the page for one service. Escape or the backdrop
// closes it; on phones it rises from the bottom.
function Dialog({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade bg-forest-950/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[88vh] w-full max-w-lg animate-rise overflow-y-auto rounded-t-md bg-sand-50 p-5 shadow-lift sm:rounded-md sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-[1.8rem] leading-tight text-forest-950">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="font-display text-[1.02rem] text-ink-600 underline underline-offset-4 hover:text-forest-900"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// One service: its photo, its name, and a few words under it
function ServiceTile({ service, onOpen }) {
  const { title, text, photo, href } = service;

  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-sand-200">
        <Image
          src={photo}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
        />
      </div>
      <h3 className="mt-2.5 font-display text-[1.15rem] leading-tight text-forest-950 group-hover:text-bark-700 sm:text-[1.3rem]">
        {title}
      </h3>
      <p className="mt-0.5 font-label text-[0.8rem] leading-snug text-ink-600 sm:text-[0.88rem]">
        {text}
      </p>
    </>
  );

  const className = "group block w-full text-left";

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => onOpen(service.key)}
      className={className}
    >
      {inner}
    </button>
  );
}

// The services of My Stay: six tiles, each opening what it does
function StayHub({ folio, charges }) {
  const [open, setOpen] = useState(null);
  const [sent, setSent] = useState(null);

  const close = () => setOpen(null);
  const done = (message) => {
    setOpen(null);
    setSent(message);
  };

  const panels = {
    housekeeping: {
      title: "Housekeeping",
      body: (
        <ChoiceForm
          type="housekeeping"
          choices={HOUSEKEEPING_CHOICES}
          question="What do you need?"
          notePlaceholder="When, or anything we should know"
          onDone={done}
        />
      ),
    },
    support: { title: "Ask us anything", body: <HelpForm onDone={done} /> },
    maintenance: {
      title: "Something broken?",
      body: (
        <ChoiceForm
          type="maintenance"
          choices={ISSUE_CHOICES}
          question="What isn't working?"
          notePlaceholder="Tell us a little more"
          withUrgency
          onDone={done}
        />
      ),
    },
    cabin: {
      title: "For the cabin",
      body: (
        <ChoiceForm
          type="housekeeping"
          choices={CABIN_ITEMS}
          question="What would you like brought over?"
          notePlaceholder="How many, or when"
          onDone={done}
        />
      ),
    },
    charges: {
      title: "Your charges",
      body: folio ? (
        <StayFolio folio={folio} charges={charges} bare />
      ) : (
        <p className="font-display text-[1.05rem] text-ink-600">
          Your charges appear here once your stay begins.
        </p>
      ),
    },
  };

  return (
    <>
      {sent && (
        <p className="mb-5 rounded-md border border-[#2d8663]/40 bg-[#e2efe6] px-5 py-4 font-display text-[1.02rem] text-[#1d5a3d]">
          {sent}
        </p>
      )}

      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.key}>
            <ServiceTile service={service} onOpen={setOpen} />
          </li>
        ))}
      </ul>

      {open && panels[open] && (
        <Dialog title={panels[open].title} onClose={close}>
          {panels[open].body}
        </Dialog>
      )}
    </>
  );
}

export default StayHub;
