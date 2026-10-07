// The same status words and colours as Ardevane Operations, so a guest and
// the front desk always see a stay the same way
const statuses = {
  reserved: { label: "Reserved", className: "bg-[#e3eef1] text-[#2e5f6e]" },
  checked_in: { label: "Checked in", className: "bg-[#e2efe6] text-[#1d5a3d]" },
  checked_out: {
    label: "Checked out",
    className: "bg-[#ece8e1] text-[#5a5248]",
  },
  cancelled: { label: "Cancelled", className: "bg-[#f8e2da] text-[#9b3b23]" },
  no_show: { label: "No-show", className: "bg-[#f1e5d9] text-[#6b4426]" },
};

function StatusTag({ status }) {
  const { label, className } = statuses[status] ?? statuses.reserved;

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
