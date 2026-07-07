const API_BASE =
	import.meta.env.VITE_API_URL ||
	import.meta.env.VITE_API_URL_LOCAL ||
	"https://ubrestaurant-backend.onrender.com";

const getToken = () => localStorage.getItem("token");

const clearAuth = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
};

const unwrapPayload = (result, fallbackKeys = []) => {
	if (result == null) return result;

	if (Array.isArray(result)) return result;

	if (result.data !== undefined) return result.data;

	for (const key of fallbackKeys) {
		if (result[key] !== undefined) {
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

// =====================================================
// Core API Function
// =====================================================

const apiCall = async (endpoint, options = {}) => {
	const token = getToken();

	const headers = {
		"Content-Type": "application/json",
		...(token &&
			!options.skipAuthHeader && {
				Authorization: `Bearer ${token}`,
			}),
		...options.headers,
	};

	const config = {
		...options,
		headers,
	};

	delete config.skipAuthHeader;

	const url = `${API_BASE}/api${endpoint}`;

	// console.log("======================================");
	// console.log("API Request");
	// console.log("URL:", url);
	// console.log("Method:", config.method || "GET");
	// console.log("Token Exists:", !!token);
	// console.log("======================================");

	try {
		const response = await fetch(url, config);

		let responseBody = {};

		try {
			responseBody = await response.json();
		} catch {
			// Empty response body
		}

		if (!response.ok) {
			// Only expire session on protected endpoints
			if (response.status === 401 && !endpoint.startsWith("/auth/")) {
				clearAuth();

				throw new Error("Session expired. Please login again.");
			}

			throw new Error(
				responseBody.message ||
					responseBody.error ||
					`API Error (${response.status})`,
			);
		}

		if (response.status === 204) {
			return {};
		}

		return responseBody;
	} catch (error) {
		console.error(`API Request Failed [${config.method || "GET"} ${endpoint}]`);
		console.error(error);

		throw error;
	}
};

// =====================================================
// API Service
// =====================================================

export const api = {
	// ==========================
	// Authentication
	// ==========================

	login: async (credentials) => {
		clearAuth();

		return normalizeAuthResponse(
			await apiCall("/auth/login", {
				method: "POST",
				body: JSON.stringify(credentials),
				skipAuthHeader: true,
			}),
		);
	},

	register: async (userData) => {
		clearAuth();

		return normalizeAuthResponse(
			await apiCall("/auth/signup", {
				method: "POST",
				body: JSON.stringify(userData),
				skipAuthHeader: true,
			}),
		);
	},

	getMe: async () => unwrapPayload(await apiCall("/users/me"), ["user"]),

	// ==========================
	// Products
	// ==========================

	getProducts: async () =>
		unwrapArray(await apiCall("/products"), ["products", "items"]),

	toggleProductAvailability: async (id) =>
		unwrapPayload(
			await apiCall(`/products/${id}/toggle-stock`, {
				method: "PATCH",
			}),
			["product"],
		),

	// ==========================
	// Orders
	// ==========================

	getOrders: async () => unwrapArray(await apiCall("/orders"), ["orders"]),

	getMyOrders: async () => unwrapArray(await apiCall("/orders/my"), ["orders"]),

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

	// ==========================
	// Users
	// ==========================

	getCustomers: async () =>
		unwrapArray(await apiCall("/users/customers"), ["customers", "users"]),

	updateUserRole: async (id, role) =>
		unwrapPayload(
			await apiCall(`/users/${id}/role`, {
				method: "PATCH",
				body: JSON.stringify({ role }),
			}),
			["user", "customer"],
		),

	deleteUser: async (id) =>
		apiCall(`/users/${id}`, {
			method: "DELETE",
		}),

	// ==========================
	// Payments
	// ==========================

	initializePayment: async (paymentData) =>
		apiCall("/payment/initialize", {
			method: "POST",
			body: JSON.stringify(paymentData),
		}),

	verifyPayment: async (reference) => apiCall(`/payment/verify/${reference}`),
};

export default api;
