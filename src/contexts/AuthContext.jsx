import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api";

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

const clearStoredAuth = () => {
	localStorage.removeItem(TOKEN_STORAGE_KEY);
	localStorage.removeItem(USER_STORAGE_KEY);
};

const getStoredUser = () => {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY);
	const savedUser = localStorage.getItem(USER_STORAGE_KEY);

	if (!token || !savedUser) {
		return null;
	}

	try {
		return JSON.parse(savedUser);
	} catch (error) {
		console.error("Failed to parse stored user:", error);
		clearStoredAuth();
		return null;
	}
};

const isAdminUser = (user) => {
	if (!user) return false;

	const role = String(user.role || user.type || user.roleName || "")
		.trim()
		.toLowerCase();

	return ["admin", "superadmin"].includes(role);
};

const AuthContext = createContext(null);

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => getStoredUser());
	const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
	const loading = false;

	const login = async (email, password) => {
		const data = await api.login({ email, password });

		localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

		setToken(data.token);
		setUser(data.user);

		return data.user;
	};

	const register = async (userData) => {
		const data = await api.register(userData);

		localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));

		setToken(data.token);
		setUser(data.user);

		return data.user;
	};

	const logout = () => {
		clearStoredAuth();

		setUser(null);
		setToken(null);
	};

	const value = useMemo(
		() => ({
			token,
			user,
			loading,
			login,
			logout,
			register,
			isAuthenticated: Boolean(token && user),
			isAdmin: isAdminUser(user),
		}),
		[token, user, loading],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
