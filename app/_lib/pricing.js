// Prices for showing while a guest picks dates. The price that counts is
// worked out by the database (quote_booking, create_booking) from the same
// formula: nights × (regular price − discount).

export function getNightlyPrice({ regularPrice, discount }) {
  return regularPrice - (discount || 0);
}

export function getStayPrice(cabin, numNights) {
  return numNights * getNightlyPrice(cabin);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
