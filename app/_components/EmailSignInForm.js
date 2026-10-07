"use client";

import { useState } from "react";
import { signInWithEmail } from "../_lib/actions";
import SubmitButton from "./SubmitButton";
import FormError from "./FormError";
import PasswordField from "./PasswordField";

function EmailSignInForm({ next }) {
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    setError("");

    // Comes back only when something is wrong. A sign in redirects.
    const result = await signInWithEmail(formData);

    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="space-y-4 text-left">
      <input type="hidden" name="next" value={next ?? ""} />

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
          autoComplete="current-password"
        />
      </div>

      <FormError message={error} />

      <SubmitButton pendingLabel="Signing in…" className="w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}

export default EmailSignInForm;
