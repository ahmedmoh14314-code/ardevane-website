"use client";

import { useState } from "react";
import { ArrowRightIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { signInWithEmail } from "../_lib/actions";
import SubmitButton from "./SubmitButton";
import FormError from "./FormError";
import { AuthField, AuthPassword } from "./AuthField";

function EmailSignInForm({ next }) {
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    setError("");

    // Comes back only when something is wrong. A sign in redirects.
    const result = await signInWithEmail(formData);

    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />

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
        autoComplete="current-password"
        placeholder="Your password"
      />

      <FormError message={error} />

      <SubmitButton pendingLabel="Signing in…" className="w-full" look="forest">
        Sign in
        <ArrowRightIcon className="h-4 w-4" />
      </SubmitButton>
    </form>
  );
}

export default EmailSignInForm;
