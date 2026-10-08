"use client";

import { useFormStatus } from "react-dom";
import SpinnerMini from "./SpinnerMini";

export default function SubmitButton({
  children,
  pendingLabel,
  disabled = false,
  className = "",
  look = "primary",
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`btn-forest px-8 ${className}`}
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
