"use client";

import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const box =
  "flex items-center gap-3 rounded-[3px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-forest-700 focus-within:ring-2 focus-within:ring-sand-200";

const input =
  "w-full bg-transparent py-3 font-label text-[0.95rem] text-ink-800 placeholder:text-ink-400 focus:outline-none";

// A labelled field with an icon inside it, the way the sign-in pages draw
// them
export function AuthField({ label, icon: Icon, id, ...props }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-label text-[0.88rem] font-medium text-ink-700"
      >
        {label}
      </label>
      <div className={box}>
        <Icon className="h-5 w-5 shrink-0 text-ink-500" />
        <input id={id} className={input} required {...props} />
      </div>
    </div>
  );
}

// How strong a new password is, from 0 to 3, by length and variety
function strength(password) {
  if (password.length < 8) return password ? 1 : 0;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) =>
    re.test(password)
  ).length;
  return password.length >= 12 && kinds >= 3 ? 3 : kinds >= 2 ? 2 : 1;
}

const strengthColors = [
  "bg-sand-300",
  "bg-[#c97a5a]",
  "bg-[#c7a24a]",
  "bg-[#2d8663]",
];

// A password field with a button to show it. For a new password it also
// shows how strong it is.
export function AuthPassword({
  label,
  id,
  name,
  autoComplete,
  placeholder,
  isNew,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState("");
  const level = isNew ? strength(value) : 0;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-label text-[0.88rem] font-medium text-ink-700"
      >
        {label}
      </label>
      <div className={box}>
        <LockClosedIcon className="h-5 w-5 shrink-0 text-ink-500" />
        <input
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          minLength={isNew ? 8 : undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={input}
          required
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          className="shrink-0 text-ink-500 hover:text-forest-900"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {isNew && (
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="font-label text-[0.78rem] text-ink-500">
            At least 8 characters
          </span>
          <span className="flex w-36 gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  level >= step ? strengthColors[level] : "bg-sand-300"
                }`}
              />
            ))}
          </span>
        </div>
      )}
    </div>
  );
}
