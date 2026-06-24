import { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";

const AdminContext = createContext(null);

const adminReducer = (state, action) => {
	switch (action.type) {
		case "UPDATE_ORDER_STATUS":
			return {
				...state,
				orders: state.orders.map((o) =>
					o._id === action.payload.id || o.id === action.payload.id ?
						{ ...o, status: action.payload.status }
					:	o,
				),
			};
		case "ADD_ORDER":
			return {
				...state,
				orders: [action.payload, ...state.orders],
				customers: state.customers.map((c) =>
					c.email === action.payload.customerEmail ?
						{ ...c, ordersCount: (c.ordersCount || 0) + 1 }
					:	c,
				),
			};

		// 🔒 Super Admin Case: Update a specific user's role string inside global state
		case "TOGGLE_USER_ROLE":
			return {
				...state,
				customers: state.customers.map((c) =>
					c._id === action.payload.id ? { ...c, role: action.payload.role } : c,
				),
			};

		// 🔒 Super Admin Case: Cleanly splice out a deleted user account from local arrays
		case "DELETE_USER":
			return {
				...state,
				customers: state.customers.filter((c) => c._id !== action.payload),
			};

		case "SET_ADMIN_DATA":
			return action.payload;
		case "SET_ORDERS":
			return { ...state, orders: action.payload };
		case "SET_CUSTOMERS":
			return { ...state, customers: action.payload };
		default:
			return state;
	}
};

export const AdminProvider = ({ children }) => {
	const [state, dispatch] = useReducer(adminReducer, {
		orders: [],
		customers: [],
	});

	const { user } = useAuth();

	// Support both basic admin roles and system owners
	const isAdmin = user?.role === "admin" || user?.role === "superadmin";
	const isSuperAdmin = user?.role === "superadmin";

	useEffect(() => {
		const loadData = async () => {
			try {
				// Fetch basic datasets concurrently
				const [ordersRes, customersRes] = await Promise.all([
					api.getOrders(),
					api.getCustomers(),
				]);
				dispatch({ type: "SET_ORDERS", payload: ordersRes });
				dispatch({ type: "SET_CUSTOMERS", payload: customersRes });
			} catch (error) {
				console.error("Admin data load failed:", error);
				if (isAdmin) {
					toast.error("Failed to load management database assets");
				}
			}
		};

		if (isAdmin) {
			loadData();
		} else {
			dispatch({
				type: "SET_ADMIN_DATA",
				payload: { orders: [], customers: [] },
			});
		}
	}, [isAdmin]);

	const updateOrderStatus = async (id, status) => {
		try {
			await api.updateOrderStatus(id, status);
			dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } });
			toast.success(`Order status updated to ${status}`);
		} catch (error) {
			console.error("Failed to update order status:", error);
			toast.error("Failed to update order status");
			throw error;
		}
	};

	const addOrder = async (order) => {
		try {
			const newOrder = await api.createOrder(order);
			dispatch({ type: "ADD_ORDER", payload: newOrder });
			toast.success("Order created successfully");
			return newOrder;
		} catch (error) {
			console.error("Failed to create order:", error);
			toast.error("Failed to create order");
			throw error;
		}
	};

	// 🔒 Super Admin Shared Wrapper: Mutate user structural permission flags
	const toggleUserRole = async (userId, currentRole) => {
		if (!isSuperAdmin) {
			toast.error("Access Denied: Action restricted to root owners.");
			return;
		}
		const newRole = currentRole === "admin" ? "user" : "admin";
		try {
			await api.updateUserRole(userId, newRole);
			dispatch({
				type: "TOGGLE_USER_ROLE",
				payload: { id: userId, role: newRole },
			});
			toast.success(`User access set to ${newRole}`);
		} catch (error) {
			console.error("Failed to adjust user profile clearance:", error);
			toast.error("Failed to modify target account parameters");
		}
	};

	// 🔒 Super Admin Shared Wrapper: Permanent entry destruction route
	const deleteUser = async (userId) => {
		if (!isSuperAdmin) {
			toast.error("Access Denied: Action restricted to root owners.");
			return;
		}
		try {
			await api.deleteUser(userId);
			dispatch({ type: "DELETE_USER", payload: userId });
			toast.success("Account permanently purged from index data");
		} catch (error) {
			console.error("Failed to delete client ledger registration:", error);
			toast.error("Failed to drop target user entry safely");
		}
	};

	return (
		<AdminContext.Provider
			value={{
				...state,
				updateOrderStatus,
				addOrder,
				toggleUserRole,
				deleteUser,
				isAdmin,
				isSuperAdmin,
			}}>
			{children}
		</AdminContext.Provider>
	);
};

export const useAdmin = () => {
	const context = useContext(AdminContext);
	if (!context)
		throw new Error("useAdmin must be used within an AdminProvider");
	return context;
};
