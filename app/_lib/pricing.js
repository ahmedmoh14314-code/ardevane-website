// One place for the money, used by the price shown in the browser and by
// the server when it saves the booking, so the two can never disagree.
// The formula is the same one Ardevane Operations uses at check-in.

export function getNightlyPrice({ regularPrice, discount }) {
  return regularPrice - (discount || 0);
}

export function getBookingPrice({
  cabin,
  numNights,
  numGuests,
  hasBreakfast,
  breakfastPrice,
}) {
  const cabinPrice = numNights * getNightlyPrice(cabin);

  const extrasPrice = hasBreakfast
    ? numNights * numGuests * breakfastPrice
    : 0;

  return { cabinPrice, extrasPrice, totalPrice: cabinPrice + extrasPrice };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
