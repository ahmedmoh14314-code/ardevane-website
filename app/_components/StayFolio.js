import { format } from "date-fns";
import { formatCurrency } from "../_lib/pricing";

// What a stay costs and what has been paid, for the guest to read. The
// front desk adds the charges and records the payments; nothing here can
// be changed by the guest.
function StayFolio({ folio, charges = [], id }) {
  if (!folio) return null;

  const { accommodation, extras, total, paid, remaining } = folio;

  return (
    <section id={id} className="card scroll-mt-24 p-6 sm:p-8">
      <p className="eyebrow mb-1">Stay charges</p>
      <h2 className="mb-6 font-display text-2xl text-brand-900">Your folio</h2>

      <dl className="space-y-2 text-ink-700">
        <div className="flex justify-between gap-4">
          <dt>Accommodation</dt>
          <dd className="tabular-nums">{formatCurrency(accommodation)}</dd>
        </div>

        {charges.length > 0 && (
          <ul className="space-y-1.5 border-l-2 border-cream-200 py-1 pl-4 text-sm text-ink-600">
            {charges.map((charge) => (
              <li key={charge.id} className="flex justify-between gap-4">
                <span>
                  {charge.description}
                  <span className="ml-2 text-ink-400">
                    {format(new Date(charge.created_at), "MMM d")}
                  </span>
                </span>
                <span className="tabular-nums">
                  {formatCurrency(charge.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-between gap-4">
          <dt>Extra charges</dt>
          <dd className="tabular-nums">{formatCurrency(extras)}</dd>
        </div>

        <div className="flex justify-between gap-4 border-t border-cream-200 pt-3 text-lg font-semibold text-ink-900">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatCurrency(total)}</dd>
        </div>

        <div className="flex justify-between gap-4 text-brand-700">
          <dt>Paid</dt>
          <dd className="tabular-nums">{formatCurrency(paid)}</dd>
        </div>

        <div
          className={`flex justify-between gap-4 font-semibold ${
            remaining > 0 ? "text-[#9b3b23]" : "text-brand-700"
          }`}
        >
          <dt>Remaining</dt>
          <dd className="tabular-nums">{formatCurrency(remaining)}</dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-ink-500">
        {remaining > 0
          ? "Still to pay at the front desk. Charges and payments are added by the front desk."
          : "Nothing left to pay. Charges and payments are added by the front desk."}
      </p>
    </section>
  );
}

export default StayFolio;
