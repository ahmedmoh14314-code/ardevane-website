"use client";

import { useFormStatus } from "react-dom";
import SpinnerMini from "./SpinnerMini";

export default function SubmitButton({
  children,
  pendingLabel,
  disabled = false,
  className = "",
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`btn-primary px-8 py-3.5 ${className}`}
      disabled={pending || disabled}
    >
      {pending ? (
        <>
          <SpinnerMini />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
