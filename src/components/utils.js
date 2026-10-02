import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount, options = {}) {
	const value = Number(amount) || 0;

	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: options.maximumFractionDigits ?? 0,
	}).format(value);
}

// =====================================================
// ORDER HELPERS
// Shared across the customer orders page and the admin
// order table so display logic stays consistent.
// =====================================================

export const getOrderDisplayId = (order, index = 0) => {
	const rawId = order.id ?? order._id ?? index + 1;
	const idAsString = String(rawId);

	return /^\d+$/.test(idAsString) ?
			`#${idAsString.padStart(4, "0")}`
		:	`#${idAsString.slice(-8).toUpperCase()}`;
};

export const getOrderTotal = (order) =>
	Number(order?.totalAmount ?? order?.total ?? order?.amount ?? 0);

export const getOrderDate = (order) => order?.date || order?.createdAt || null;

export const isOrderPaid = (order) =>
	order?.paymentStatus === "paid" ||
	order?.paymentStatus === "success" ||
	order?.isPaid === true;

export const getPaymentLabel = (order) => {
	if (isOrderPaid(order)) return "Paid";

	if (order?.paymentMode === "cod" || order?.paymentMethod === "cod") {
		return "Pay on Delivery";
	}

	return "Payment Pending";
};
