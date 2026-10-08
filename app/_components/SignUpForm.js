"use client";

import { useState } from "react";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { signUpWithEmail } from "../_lib/actions";
import SubmitButton from "./SubmitButton";
import FormError from "./FormError";
import { AuthField, AuthPassword } from "./AuthField";

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
      <div role="status" className="animate-fade space-y-3 py-4 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand-200 text-forest-900">
          <EnvelopeIcon className="h-6 w-6" />
        </span>
        <p className="font-display text-lg text-ink-700">{sentMessage}</p>
      </div>
    );

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />

      <div className="grid grid-cols-2 gap-3">
        <AuthField
          label="First name"
          icon={UserIcon}
          id="firstName"
          name="firstName"
          autoComplete="given-name"
          placeholder="Ahmed"
        />
        <AuthField
          label="Last name"
          icon={UsersIcon}
          id="lastName"
          name="lastName"
          autoComplete="family-name"
          placeholder="Mohamed"
        />
      </div>

      <AuthField
        label="Email"
        icon={EnvelopeIcon}
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
      />

      <AuthPassword
        label="Password"
        id="password"
        name="password"
        autoComplete="new-password"
        placeholder="Create a password"
        isNew
      />

      <FormError message={error} />

      <SubmitButton
        pendingLabel="Creating your account…"
        className="w-full"
        look="forest"
      >
        Create account
        <ArrowRightIcon className="h-4 w-4" />
      </SubmitButton>
    </form>
  );
}

export default SignUpForm;
