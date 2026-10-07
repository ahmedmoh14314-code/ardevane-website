// What a guest can ask for during a stay, and how each request's progress
// is worded. One lifecycle (new → in progress → completed) for every kind;
// the same words as Ardevane Operations, so guest and staff agree.

export const REQUEST_KINDS = {
  breakfast: "Breakfast",
  housekeeping: "Housekeeping",
  support: "Help",
  maintenance: "Repair",
};

const STEP_WORDS = {
  breakfast: { in_progress: "Preparing", completed: "Delivered" },
  housekeeping: { in_progress: "In progress", completed: "Completed" },
  support: { in_progress: "In progress", completed: "Resolved" },
  maintenance: { in_progress: "In progress", completed: "Fixed" },
};

export function requestStatusLabel(type, status) {
  if (status === "new") return "New";
  return STEP_WORDS[type]?.[status] ?? status;
}

export const HOUSEKEEPING_CHOICES = [
  "Fresh towels",
  "Room cleaning",
  "Bed linen",
  "Bathroom supplies",
  "Trash pickup",
];

export const ISSUE_CHOICES = [
  "Air conditioning not working",
  "Hot water issue",
  "Light not working",
  "Door or lock issue",
  "Other",
];

// Breakfast times a guest can pick, every half hour of the morning
export const BREAKFAST_TIMES = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
];

// What a breakfast order costs, from the menu prices
export function orderTotal(menu = [], quantities = {}) {
  return menu.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] ?? 0),
    0
  );
}

// The dishes picked, as the database expects them
export function orderItems(quantities = {}) {
  return Object.entries(quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([serviceId, quantity]) => ({
      serviceId: Number(serviceId),
      quantity,
    }));
}
