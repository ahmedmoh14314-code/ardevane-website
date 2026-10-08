// What a guest can ask for during a stay, and how each request's progress
// is worded. One lifecycle (new → in progress → completed) for every kind;
// the same words as Ardevane Operations, so guest and staff agree.

export const REQUEST_KINDS = {
  dining: "Dining",
  housekeeping: "Housekeeping",
  support: "Help",
  maintenance: "Repair",
};

const STEP_WORDS = {
  dining: { in_progress: "Preparing", completed: "Delivered" },
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

// Things a guest can ask to have brought to the cabin
export const CABIN_ITEMS = [
  "Extra pillows",
  "Extra blanket",
  "Firewood",
  "Baby cot",
  "Toiletries",
  "Coffee & tea refill",
];

export const ISSUE_CHOICES = [
  "Air conditioning not working",
  "Hot water issue",
  "Light not working",
  "Door or lock issue",
  "Other",
];

// The sections of the menu, in the order of the day, and the times food
// can be brought for each
export const COURSES = [
  { key: "breakfast", label: "Breakfast", from: "07:00", to: "11:00" },
  { key: "lunch", label: "Lunch", from: "12:00", to: "15:30" },
  { key: "dinner", label: "Dinner", from: "18:00", to: "22:00" },
  { key: "desserts", label: "Desserts", from: "12:00", to: "22:30" },
  { key: "drinks", label: "Drinks", from: "07:00", to: "22:30" },
];

// Every half hour from one time to another: "07:00", "07:30", …
export function halfHours(from = "07:00", to = "22:30") {
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const times = [];

  for (let m = toMinutes(from); m <= toMinutes(to); m += 30)
    times.push(
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`
    );

  return times;
}

// The times an order can be brought: from the earliest to the latest of
// the sections it has dishes from
export function orderTimes(menu = [], quantities = {}) {
  const courses = new Set(
    menu.filter((item) => quantities[item.id] > 0).map((item) => item.course)
  );
  const chosen = COURSES.filter((course) => courses.has(course.key));
  if (!chosen.length) return halfHours();

  const from = chosen.map((c) => c.from).sort()[0];
  const to = chosen
    .map((c) => c.to)
    .sort()
    .at(-1);
  return halfHours(from, to);
}

// What a food order costs, from the menu prices
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
