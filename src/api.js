const API_BASE =
	import.meta.env.VITE_API_URL ||
	import.meta.env.VITE_API_URL_LOCAL ||
	"http://localhost:5000";

const unwrapPayload = (result, fallbackKeys = []) => {
	// console.log("Unwrapped API response:", result);
	if (result == null) {
		return result;
	}

	if (Array.isArray(result)) {
		return result;
	}

	if (result.data != null) {
		return result.data;
	}

	for (const key of fallbackKeys) {
		if (result[key] != null) {
			return result[key];
		}
	}

	return result;
};

const unwrapArray = (result, fallbackKeys = []) => {
	const payload = unwrapPayload(result, fallbackKeys);
	return Array.isArray(payload) ? payload : [];
};

const normalizeAuthResponse = (result) => {
	const payload = unwrapPayload(result);

	return {
		...result,
		...(payload && typeof payload === "object" ? payload : {}),
		token: result?.token ?? payload?.token,
		user: result?.user ?? payload?.user ?? payload,
	};
};

const apiCall = async (endpoint, options = {}) => {
	try {
		const token = localStorage.getItem("token");

		const config = {
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
				...options.headers,
			},
			...options,
		};

		// 👇 IF YOUR BACKEND DOES NOT USE THE "/api" PREFIX, CHANGE THIS LINE TO:
		const response = await fetch(`${API_BASE}${endpoint}`, config);

		if (!response.ok) {
			let errorMessage = `API Error: ${response.status}`;
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
			} catch {
				// Ignore if response body is not JSON
			}
			throw new Error(errorMessage);
		}

		if (response.status === 204) {
			return {};
		}

		return await response.json();
	} catch (error) {
		console.error(
			`API call failed [${options.method || "GET"} ${endpoint}]:`,
			error,
		);
		throw error;
	}
};

// Main API service
export const api = {
	// Products
	getProducts: async () => {
		const result = await apiCall("/products");
		return unwrapArray(result, ["products", "items"]);
	},

	// Orders
	getOrders: async () => unwrapArray(await apiCall("/orders"), ["orders"]), // Admin - all orders
	getMyOrders: async () => unwrapArray(await apiCall("/orders/my"), ["orders"]), // User - their own orders
	createOrder: async (orderData) =>
		unwrapPayload(
			await apiCall("/orders", {
				method: "POST",
				body: JSON.stringify(orderData),
			}),
			["order"],
		),
	updateOrderStatus: async (id, status) =>
		unwrapPayload(
			await apiCall(`/orders/${id}`, {
				method: "PATCH",
				body: JSON.stringify({ status }),
			}),
			["order"],
		),

	// Users / Customers
	getCustomers: async () =>
		unwrapArray(await apiCall("/users/customers"), ["customers", "users"]), // Admin only
	getMe: async () => unwrapPayload(await apiCall("/users/me"), ["user"]), // Current user profile

	// Auth
	login: async (credentials) =>
		normalizeAuthResponse(
			await apiCall("/auth/login", {
				method: "POST",
				body: JSON.stringify(credentials),
			}),
		),

	register: async (userData) =>
		normalizeAuthResponse(
			await apiCall("/auth/signup", {
				method: "POST",
				body: JSON.stringify(userData),
			}),
		),

	// Payment
	initializePayment: (paymentData) =>
		apiCall("/payment/initialize", {
			method: "POST",
			body: JSON.stringify(paymentData),
		}),
	verifyPayment: (reference) => apiCall(`/payment/verify/${reference}`),
};

export default api;
