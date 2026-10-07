import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

function FormError({ message }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="flex animate-fade items-start gap-2 rounded-xl bg-[#f8e2da] px-4 py-3 text-sm text-[#9b3b23]"
    >
      <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
      {message}
    </p>
  );
}

export default FormError;
