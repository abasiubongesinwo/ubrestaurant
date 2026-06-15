// import { createContext, useContext, useMemo, useState } from "react";
// import api from "../api";

// const TOKEN_STORAGE_KEY = "token";
// const USER_STORAGE_KEY = "user";

// const getStoredUser = () => {
// 	const token = localStorage.getItem(TOKEN_STORAGE_KEY);
// 	const savedUser = localStorage.getItem(USER_STORAGE_KEY);

// 	if (!token || !savedUser) {
// 		return null;
// 	}

// 	try {
// 		return JSON.parse(savedUser);
// 	} catch (error) {
// 		console.error("Failed to parse stored user:", error);
// 		localStorage.removeItem(TOKEN_STORAGE_KEY);
// 		localStorage.removeItem(USER_STORAGE_KEY);
// 		return null;
// 	}
// };

// const isAdminUser = (user) => {
// 	if (!user) return false;

// 	const role = String(
// 		user.role || user.type || user.roleName || "",
// 	).toLowerCase();

// 	return ["admin", "superadmin"].includes(role) || user.isAdmin || user.admin;
// };

// // const isAdminUser = (user) => {
// // 	if (!user) return false;
// // 	const role = String(
// // 		user.role || user.type || user.roleName || "",
// // 	).toLowerCase();
// // 	return (
// // 		["admin", "superadmin"].includes(role) ||
// // 		user.isAdmin ||
// // 		user.admin ||
// // 		user.email?.toLowerCase() === "admin@ubrestaurant.com"
// // 	);
// // };

// const AuthContext = createContext(null);

// export const useAuth = () => {
// 	const context = useContext(AuthContext);
// 	if (!context) {
// 		throw new Error("useAuth must be used within an AuthProvider");
// 	}
// 	return context;
// };

// export const AuthProvider = ({ children }) => {
// 	const [user, setUser] = useState(() => getStoredUser());
// 	const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
// 	const loading = false;

// 	// const login = async (email, password) => {
// 	// 	try {
// 	// 		const data = await api.login({ email, password });

// 	// 		localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
// 	// 		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
// 	// 		setUser(data.user);
// 	// 		setToken(data.token);

// 	// 		return data.user;
// 	// 	} catch (error) {
// 	// 		console.error("Login error:", error);
// 	// 		throw error;
// 	// 	}
// 	// };

// 	const login = async (email, password) => {
// 		const data = await api.login({ email, password });

// 		localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
// 		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

// 		setToken(data.token);
// 		setUser(data.user);

// 		return data.user;
// 	};

// 	// const logout = () => {
// 	// 	localStorage.removeItem(TOKEN_STORAGE_KEY);
// 	// 	localStorage.removeItem(USER_STORAGE_KEY);
// 	// 	setUser(null);
// 	// 	setToken(null);
// 	// };

// 	const logout = () => {
// 		localStorage.removeItem(TOKEN_STORAGE_KEY);
// 		localStorage.removeItem(USER_STORAGE_KEY);

// 		setToken(null);
// 		setUser(null);
// 	};

// 	// const register = async (userData) => {
// 	// 	try {
// 	// 		const data = await api.register(userData);

// 	// 		localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
// 	// 		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
// 	// 		setUser(data.user);
// 	// 		setToken(data.token);

// 	// 		return data.user;
// 	// 	} catch (error) {
// 	// 		console.error("Registration error:", error);
// 	// 		throw error;
// 	// 	}
// 	// };

// 	const register = async (userData) => {
// 		const data = await api.register(userData);

// 		localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
// 		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

// 		setToken(data.token);
// 		setUser(data.user);

// 		return data.user;
// 	};

// 	const value = useMemo(
// 		() => ({
// 			token,
// 			user,
// 			loading,
// 			login,
// 			logout,
// 			register,
// 			isAuthenticated: !!token && !!user,
// 			isAdmin: isAdminUser(user),
// 		}),
// 		[loading, user, token],
// 	);

// 	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import { createContext, useContext, useMemo, useState } from "react";
import api from "../api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const getStoredUser = () => {
	const token = localStorage.getItem(TOKEN_KEY);
	const user = localStorage.getItem(USER_KEY);

	if (!token || !user) return null;

	try {
		return JSON.parse(user);
	} catch {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
		return null;
	}
};

const isAdminUser = (user) => {
	if (!user) return false;

	const role = String(user.role || "").toLowerCase();

	return ["admin", "superadmin"].includes(role);
};

const AuthContext = createContext(null);

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => getStoredUser());
	const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));

	const isAuthenticated = !!token && !!user;

	const login = async (email, password) => {
		const data = await api.login({ email, password });

		localStorage.setItem(TOKEN_KEY, data.token);
		localStorage.setItem(USER_KEY, JSON.stringify(data.user));

		setToken(data.token);
		setUser(data.user);

		return data.user;
	};

	const register = async (userData) => {
		const data = await api.register(userData);

		localStorage.setItem(TOKEN_KEY, data.token);
		localStorage.setItem(USER_KEY, JSON.stringify(data.user));

		setToken(data.token);
		setUser(data.user);

		return data.user;
	};

	const logout = () => {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);

		setToken(null);
		setUser(null);
	};

	const value = useMemo(
		() => ({
			user,
			token,
			login,
			register,
			logout,
			isAuthenticated,
			isAdmin: isAdminUser(user),
		}),
		[user, token],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
