// The same status colours as the bookings table in Ardevane Operations, so
// a guest and the front desk always see a stay the same way
const statuses = {
  unconfirmed: {
    label: "Reserved",
    className: "bg-[#f8ecd2] text-[#8a5a12]",
  },
  "checked-in": {
    label: "Checked in",
    className: "bg-[#e2efe6] text-[#1d5a3d]",
  },
  "checked-out": {
    label: "Checked out",
    className: "bg-[#ece8e1] text-[#5a5248]",
  },
  paid: { label: "Paid", className: "bg-[#e2efe6] text-[#1d5a3d]" },
  due: { label: "Pay on arrival", className: "bg-[#e3eef1] text-[#2e5f6e]" },
};

function StatusTag({ status }) {
  const { label, className } = statuses[status] ?? statuses.unconfirmed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default StatusTag;
