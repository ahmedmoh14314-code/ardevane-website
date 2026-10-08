"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ChatBubbleOvalLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  LifebuoyIcon,
  SparklesIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import breakfastPhoto from "@/public/img/stay/breakfast.jpg";
import housekeepingPhoto from "@/public/img/stay/housekeeping.jpg";
import helpPhoto from "@/public/img/stay/help.jpg";
import maintenancePhoto from "@/public/img/stay/maintenance.jpg";
import cabinRequestsPhoto from "@/public/img/stay/cabin-requests.jpg";
import stayChargesPhoto from "@/public/img/stay/stay-charges.jpg";
import bannerPhoto from "@/public/img/home/escape.jpg";

import StayFolio from "./StayFolio";
import { createStayRequest } from "../_lib/actions";
import {
  CABIN_ITEMS,
  HOUSEKEEPING_CHOICES,
  ISSUE_CHOICES,
} from "../_lib/requests";

// Thin line icons the heroicons set doesn't have
function CutleryIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      {...props}
    >
      <path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M7 3v4M9 3v4M11 3v4" />
      <path d="M17 21V3c-2 1.5-3 4-3 7v4h3" />
    </svg>
  );
}

function ArmchairIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 11V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" />
      <path d="M4 11a2 2 0 0 1 2 2v2h12v-2a2 2 0 1 1 2 2v3H4v-3a2 2 0 0 1 0-4z" />
      <path d="M6 18v2M18 18v2" />
    </svg>
  );
}

// The six things a guest can do from My Stay
const services = [
  {
    key: "dining",
    title: "Breakfast",
    text: "Order breakfast to your cabin.",
    photo: breakfastPhoto,
    icon: CutleryIcon,
    href: "/my-stay/menu",
  },
  {
    key: "housekeeping",
    title: "Housekeeping",
    text: "Request housekeeping service.",
    photo: housekeepingPhoto,
    icon: SparklesIcon,
  },
  {
    key: "support",
    title: "Help & Support",
    text: "Get help from our team.",
    photo: helpPhoto,
    icon: LifebuoyIcon,
  },
  {
    key: "maintenance",
    title: "Maintenance",
    text: "Report a maintenance issue.",
    photo: maintenancePhoto,
    icon: WrenchIcon,
  },
  {
    key: "cabin",
    title: "Cabin Requests",
    text: "Request additional items.",
    photo: cabinRequestsPhoto,
    icon: ArmchairIcon,
  },
  {
    key: "charges",
    title: "Stay Charges",
    text: "View your stay charges.",
    photo: stayChargesPhoto,
    icon: DocumentTextIcon,
  },
];

const field =
  "w-full rounded-[3px] border border-sand-300 bg-white px-4 py-2.5 font-display text-ink-800 placeholder:text-ink-400 focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-sand-200";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 font-display text-[0.98rem] transition-colors ${
        active
          ? "border-forest-900 bg-forest-900 text-sand-50"
          : "border-sand-300 bg-white text-ink-700 hover:border-forest-700"
      }`}
    >
      {children}
    </button>
  );
}

function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="kicker mb-2 block text-ink-600">
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
        <p className="rounded-[3px] bg-[#f8e2da] px-4 py-3 text-sm text-[#9b3b23]">
          {error}
        </p>
      )}

      <button className="btn-forest w-full" disabled={disabled || isPending}>
        {isPending ? "Sending…" : submitLabel}
        {!isPending && <ArrowRightIcon className="h-4 w-4" />}
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
        <label className="flex items-center gap-3 font-display text-ink-700">
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
          "Our team has your message. You'll see it below as it moves on."
        )
      }
      error={error}
      isPending={isPending}
      disabled={!subject.trim()}
      submitLabel="Send to our team"
    >
      <div>
        <Label htmlFor="help-subject">Subject</Label>
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
        <Label htmlFor="help-note">Message</Label>
        <textarea
          id="help-note"
          rows={4}
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

// A calm panel over the page for one service. Escape or the backdrop
// closes it.
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
        className="relative max-h-[88vh] w-full max-w-lg animate-rise overflow-y-auto rounded-t-md bg-sand-50 p-6 shadow-lift sm:rounded-md sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="font-display text-[1.9rem] leading-tight text-forest-950">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-ink-600 hover:bg-sand-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ServiceTile({ service, onOpen }) {
  const { title, text, photo, icon: Icon, href } = service;

  const inner = (
    <>
      {/* Wide screens: the photo above, the words below */}
      <div className="relative hidden aspect-[2.35/1] overflow-hidden sm:block">
        <Image
          src={photo}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 30vw, 45vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex items-center gap-3 p-3 sm:gap-4 sm:px-5 sm:py-4">
        {/* Phones: a small photo beside the words */}
        <div className="relative h-[4.4rem] w-[6.4rem] shrink-0 overflow-hidden rounded-[3px] sm:hidden">
          <Image
            src={photo}
            alt=""
            fill
            placeholder="blur"
            sizes="7rem"
            className="object-cover"
          />
        </div>

        <Icon className="h-7 w-7 shrink-0 text-bark-700" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[1.25rem] leading-tight text-forest-950">
            {title}
          </h3>
          <p className="mt-0.5 font-label text-[0.82rem] text-ink-600">
            {text}
          </p>
        </div>

        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-900 text-sand-50 transition-transform duration-300 group-hover:translate-x-1 sm:flex">
          <ArrowRightIcon className="h-4 w-4" />
        </span>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-600 sm:hidden" />
      </div>
    </>
  );

  const className =
    "group block overflow-hidden rounded-md border border-sand-200 bg-sand-50 text-left shadow-soft transition-shadow duration-300 hover:shadow-lift";

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => onOpen(service.key)}
      className={`w-full ${className}`}
    >
      {inner}
    </button>
  );
}

// The services of My Stay: six tiles, each opening what it does, and the
// banner for anything else
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
          notePlaceholder="Anything we should know? (optional)"
          onDone={done}
        />
      ),
    },
    support: { title: "Help & Support", body: <HelpForm onDone={done} /> },
    maintenance: {
      title: "Maintenance",
      body: (
        <ChoiceForm
          type="maintenance"
          choices={ISSUE_CHOICES}
          question="What isn't working?"
          notePlaceholder="Tell us a little more (optional)"
          withUrgency
          onDone={done}
        />
      ),
    },
    cabin: {
      title: "Cabin Requests",
      body: (
        <ChoiceForm
          type="housekeeping"
          choices={CABIN_ITEMS}
          question="What would you like brought to your cabin?"
          notePlaceholder="How many, or when? (optional)"
          onDone={done}
        />
      ),
    },
    charges: {
      title: "Stay Charges",
      body: folio ? (
        <StayFolio folio={folio} charges={charges} bare />
      ) : (
        <p className="font-display text-ink-600">
          Your charges appear here once your stay begins.
        </p>
      ),
    },
  };

  return (
    <>
      {sent && (
        <p className="mb-5 flex items-center gap-3 rounded-md border border-sand-200 bg-white px-5 py-4 font-display text-forest-900 shadow-soft">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#2d8663]" />
          {sent}
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.key}>
            <ServiceTile service={service} onOpen={setOpen} />
          </li>
        ))}
      </ul>

      {/* Anything else */}
      <section className="relative isolate mt-6 overflow-hidden rounded-md border border-sand-200 bg-sand-100 sm:mt-8 sm:border-0">
        <Image
          src={bannerPhoto}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="-z-10 hidden object-cover object-[65%_center] sm:block"
        />
        <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-forest-950/85 via-forest-950/45 to-transparent sm:block" />

        <div className="flex items-center justify-between gap-4 p-4 sm:block sm:px-12 sm:py-12">
          <div>
            <h2 className="font-display text-[1.25rem] text-forest-950 sm:text-[2rem] sm:text-white">
              Need anything else?
            </h2>
            <p className="mt-1 max-w-xs font-label text-[0.85rem] text-ink-600 sm:mt-3 sm:text-[0.95rem] sm:leading-relaxed sm:text-sand-100">
              <span className="sm:hidden">
                Our team is always happy to help.
              </span>
              <span className="hidden sm:inline">
                Our team is always happy to help you have the best stay
                possible.
              </span>
            </p>
          </div>

          <button
            onClick={() => setOpen("support")}
            className="btn-forest shrink-0 py-2.5 sm:hidden"
          >
            <ChatBubbleOvalLeftIcon className="h-4 w-4" />
            Contact Us
          </button>
          <button
            onClick={() => setOpen("support")}
            className="btn-outline-light mt-6 hidden sm:inline-flex"
          >
            Contact Us
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </section>

      {open && panels[open] && (
        <Dialog title={panels[open].title} onClose={close}>
          {panels[open].body}
        </Dialog>
      )}
    </>
  );
}

export default StayHub;
