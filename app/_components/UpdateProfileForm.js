"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { updateGuest } from "../_lib/actions";
import SubmitButton from "./SubmitButton";
import FormError from "./FormError";

function UpdateProfileForm({ guest, children }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { fullName, email, nationalID, countryFlag } = guest;

  async function handleSubmit(formData) {
    setError("");
    setSuccess("");

    const result = await updateGuest(formData);

    if (result?.error) setError(result.error);
    if (result?.success) setSuccess(result.success);
  }

  return (
    <form action={handleSubmit} className="card space-y-5 p-5 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="label">Full name</label>
          <input disabled defaultValue={fullName} className="field" />
        </div>

        <div>
          <label className="label">Email address</label>
          <input disabled defaultValue={email} className="field" />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="nationality" className="label mb-0">
            Where are you from?
          </label>
          {countryFlag && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={countryFlag}
              alt="Country flag"
              className="h-5 rounded-sm shadow-sm"
            />
          )}
        </div>

        {children}
      </div>

      <div>
        <label htmlFor="nationalID" className="label">
          National ID or passport number
        </label>
        <input
          id="nationalID"
          name="nationalID"
          defaultValue={nationalID ?? ""}
          className="field"
          placeholder="6 to 12 letters or numbers"
          autoComplete="off"
        />
      </div>

      <FormError message={error} />

      {success && (
        <p
          role="status"
          className="flex animate-fade items-center gap-2 rounded-[3px] bg-[#e2efe6] px-4 py-3 font-label text-sm text-[#1d5a3d]"
        >
          <CheckCircleIcon className="h-5 w-5" />
          {success}
        </p>
      )}

      <div className="border-t border-sand-200 pt-5 sm:flex sm:justify-end">
        <SubmitButton pendingLabel="Saving…" className="w-full sm:w-auto">
          Save profile
        </SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
