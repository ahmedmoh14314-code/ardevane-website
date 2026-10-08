import Image from "next/image";
import { format } from "date-fns";
import { CheckIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../_lib/pricing";
import { REQUEST_KINDS, requestStatusLabel } from "../_lib/requests";

const STEPS = ["new", "in_progress", "completed"];

const statusStyles = {
  new: "bg-sand-200 text-ink-700",
  in_progress: "bg-[#e3eef1] text-[#2e5f6e]",
  completed: "bg-[#e2efe6] text-[#1d5a3d]",
};

// Received, then Preparing (or In progress), then Delivered (or Done):
// the words the front desk uses, as a line the guest can follow
function StatusSteps({ type, status }) {
  const current = STEPS.indexOf(status);

  return (
    <ol className="grid grid-cols-3 gap-2">
      {STEPS.map((step, i) => {
        const isDone = i <= current;
        const isNow = i === current && status !== "completed";

        return (
          <li key={step} className="min-w-0">
            <span
              className={`block h-1 rounded-full ${
                isDone ? "bg-forest-900" : "bg-sand-300"
              } ${isNow ? "animate-pulse" : ""}`}
            />
            <span
              className={`mt-2 flex items-center gap-1 font-label text-[0.78rem] ${
                isDone ? "text-forest-900" : "text-ink-400"
              } ${isNow ? "font-semibold" : ""}`}
            >
              {isDone && !isNow && <CheckIcon className="h-3.5 w-3.5" />}
              {step === "new" ? "Received" : requestStatusLabel(type, step)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// The dishes of an order, as small photos with how many of each
function Dishes({ items }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {items.map((item) => (
        <li key={item.name} className="w-[4.5rem]">
          <div className="relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-[3px] bg-sand-200">
            {item.services?.image ? (
              <Image
                src={item.services.image}
                alt=""
                fill
                sizes="4.5rem"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center font-display text-2xl text-forest-950/40">
                {item.name.charAt(0)}
              </span>
            )}
            {item.quantity > 1 && (
              <span className="absolute bottom-1 right-1 rounded-full bg-forest-950/85 px-1.5 font-label text-[0.7rem] font-semibold text-sand-50">
                &times;{item.quantity}
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 font-label text-[0.72rem] leading-tight text-ink-600">
            {item.name}
          </p>
        </li>
      ))}
    </ul>
  );
}

function whenFor({ requestedDate, requestedFor }) {
  if (!requestedDate && !requestedFor) return null;

  return [
    requestedDate && format(new Date(`${requestedDate}T00:00`), "EEE, MMM d"),
    requestedFor && `at ${requestedFor.slice(0, 5)}`,
  ]
    .filter(Boolean)
    .join(" ");
}

// What the guest asked for and where each request stands, open ones
// first. Only the front desk moves a request on; the guest follows it.
function StayRequests({ requests = [], title = "Your orders & requests" }) {
  if (!requests.length) return null;

  const sorted = [...requests].sort(
    (a, b) =>
      (a.status === "completed") - (b.status === "completed") ||
      b.created_at.localeCompare(a.created_at)
  );

  return (
    <section>
      <h2 className="mb-4 font-display text-[1.7rem] text-forest-950 sm:text-[1.9rem]">
        {title}
      </h2>

      <ul className="grid gap-4 lg:grid-cols-2">
        {sorted.map((request) => {
          const items = request.request_items ?? [];
          const total = items.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0
          );
          const isDone = request.status === "completed";
          const when = whenFor(request);

          return (
            <li
              key={request.id}
              className={`flex flex-col gap-4 rounded-md border bg-sand-50 p-5 shadow-soft ${
                isDone ? "border-sand-200" : "border-forest-900/25"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="min-w-0">
                    <p className="font-display text-[1.2rem] leading-tight text-forest-950">
                      {request.type === "dining" ? "Food order" : request.title}
                    </p>
                    <p className="font-label text-[0.8rem] text-ink-500">
                      {[
                        request.type === "dining"
                          ? null
                          : REQUEST_KINDS[request.type],
                        when,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                  {request.priority === "urgent" && !isDone && (
                    <span className="rounded-full bg-[#f8e2da] px-3 py-1 font-label text-xs font-semibold text-[#9b3b23]">
                      Urgent
                    </span>
                  )}
                  <span
                    className={`rounded-full px-3 py-1 font-label text-xs font-semibold ${statusStyles[request.status]}`}
                  >
                    {request.status === "new"
                      ? "Received"
                      : requestStatusLabel(request.type, request.status)}
                  </span>
                </div>
              </div>

              {request.type === "dining" && items.length > 0 && (
                <Dishes items={items} />
              )}

              {request.note && (
                <p className="font-label text-[0.85rem] italic text-ink-500">
                  &ldquo;{request.note}&rdquo;
                </p>
              )}

              <div className="mt-auto space-y-3 border-t border-sand-200 pt-4">
                <StatusSteps type={request.type} status={request.status} />
                <p className="flex justify-between font-label text-[0.8rem] text-ink-500">
                  <span>
                    Sent {format(new Date(request.created_at), "MMM d, HH:mm")}
                  </span>
                  {total > 0 && (
                    <span className="font-display text-[1.05rem] text-forest-950">
                      {formatCurrency(total)}
                    </span>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default StayRequests;
