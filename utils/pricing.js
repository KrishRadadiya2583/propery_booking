// Single source of truth for booking price math.
// Client and server must use the same formula.

const SERVICE_FEE_RATE = 0.06;

function computeNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    const from = new Date(checkIn);
    const to = new Date(checkOut);
    if (isNaN(from) || isNaN(to)) return 0;
    return Math.max(0, Math.ceil((to - from) / (1000 * 60 * 60 * 24)));
}

function computeBookingPrice({ pricePerNight, checkIn, checkOut, guests }) {
    const nights = computeNights(checkIn, checkOut);
    const g = Math.max(1, Number(guests) || 1);
    const p = Math.max(0, Number(pricePerNight) || 0);
    const subtotal = nights * p * g;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
    const totalPrice = subtotal + serviceFee;
    return { nights, guests: g, subtotal, serviceFee, totalPrice };
}

module.exports = { SERVICE_FEE_RATE, computeNights, computeBookingPrice };
