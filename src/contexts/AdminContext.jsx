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
					o.id === action.payload.id ?
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

	const auth = useAuth();

	useEffect(() => {
		const loadData = async () => {
			try {
				const [ordersRes, customersRes] = await Promise.all([
					api.getOrders(),
					api.getCustomers(),
				]);
				dispatch({ type: "SET_ORDERS", payload: ordersRes });
				dispatch({ type: "SET_CUSTOMERS", payload: customersRes });
			} catch (error) {
				console.error("Admin data load failed:", error);
				if (auth.isAdmin) {
					toast.error("Failed to load admin data");
				}
			}
		};

		if (auth.isAdmin) {
			loadData();
		} else {
			dispatch({
				type: "SET_ADMIN_DATA",
				payload: { orders: [], customers: [] },
			});
		}
	}, [auth.isAdmin]);

	const updateOrderStatus = async (id, status) => {
		try {
			await api.updateOrderStatus(id, status);
			dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } });
			toast.success(`Order ${id} status updated to ${status}`);
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

	const isAdmin = auth.isAdmin;

	return (
		<AdminContext.Provider
			value={{ ...state, updateOrderStatus, addOrder, isAdmin }}>
			{children}
		</AdminContext.Provider>
	);
};

export const useAdmin = () => {
	const context = useContext(AdminContext);
	if (!context) throw new Error("useAdmin must be within AdminProvider");
	return context;
};
