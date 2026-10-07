import { format } from "date-fns";
import { formatCurrency } from "../_lib/pricing";
import { REQUEST_KINDS, requestStatusLabel } from "../_lib/requests";

const statusStyles = {
  new: "bg-cream-100 text-ink-600",
  in_progress: "bg-[#e3eef1] text-[#2e5f6e]",
  completed: "bg-[#e2efe6] text-[#1d5a3d]",
};

// What the guest asked for during a stay and where each request stands.
// Only the front desk moves a request on; the guest just sees it.
function StayRequests({ requests = [], title = "Your requests" }) {
  if (!requests.length) return null;

  return (
    <section className="card p-6 sm:p-8">
      <p className="eyebrow mb-1">From the front desk</p>
      <h2 className="mb-4 font-display text-2xl text-brand-900">{title}</h2>

      <ul className="divide-y divide-cream-100">
        {requests.map((request) => {
          const total = (request.request_items ?? []).reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0
          );

          return (
            <li
              key={request.id}
              className="flex flex-wrap items-start justify-between gap-3 py-4"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">
                  {REQUEST_KINDS[request.type]}
                </p>
                <p className="font-medium text-ink-800">{request.title}</p>
                <p className="text-sm text-ink-500">
                  {format(new Date(request.created_at), "MMM d, HH:mm")}
                  {request.requestedFor &&
                    ` · for ${request.requestedFor.slice(0, 5)}`}
                  {total > 0 && ` · ${formatCurrency(total)}`}
                </p>
                {request.note && (
                  <p className="mt-1 text-sm italic text-ink-500">
                    &ldquo;{request.note}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {request.priority === "urgent" &&
                  request.status !== "completed" && (
                    <span className="rounded-full bg-[#f8e2da] px-3 py-1 text-xs font-semibold text-[#9b3b23]">
                      Urgent
                    </span>
                  )}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                >
                  {requestStatusLabel(request.type, request.status)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default StayRequests;
