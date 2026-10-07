"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// A password input with a button to show what was typed
function PasswordField({ id, name, autoComplete, placeholder }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={isVisible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="field pr-12"
        required
      />

      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink-400 hover:text-brand-700"
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

export default PasswordField;
