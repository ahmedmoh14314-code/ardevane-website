"use client";

import { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { signUpWithEmail } from "../_lib/actions";
import SubmitButton from "./SubmitButton";
import FormError from "./FormError";
import PasswordField from "./PasswordField";

function SignUpForm({ next }) {
  const [error, setError] = useState("");
  const [sentMessage, setSentMessage] = useState("");

  async function handleSubmit(formData) {
    setError("");

    const result = await signUpWithEmail(formData);

    if (result?.error) setError(result.error);
    if (result?.success) setSentMessage(result.success);
  }

  // The account exists; it only needs the email address confirmed
  if (sentMessage)
    return (
      <div role="status" className="animate-fade space-y-3 py-4">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <EnvelopeIcon className="h-6 w-6" />
        </span>
        <p className="text-ink-700">{sentMessage}</p>
      </div>
    );

  return (
    <form action={handleSubmit} className="space-y-4 text-left">
      <input type="hidden" name="next" value={next ?? ""} />

      <div>
        <label htmlFor="fullName" className="label">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          className="field"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="field"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <PasswordField
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
      </div>

      <FormError message={error} />

      <SubmitButton pendingLabel="Creating your account…" className="w-full">
        Create account
      </SubmitButton>
    </form>
  );
}

export default SignUpForm;
