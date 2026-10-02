import {
	createContext,
	useContext,
	useReducer,
	useEffect,
	useCallback,
} from "react";

const CartContext = createContext();
const CART_STORAGE_KEY = "ubrestaurant-cart";

const calculateTotal = (items) =>
	items.reduce((sum, item) => {
		return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
	}, 0);

const normalizeCartItem = (product, quantity = 1) => {
	if (!product) {
		return null;
	}

	const id = product.id ?? product._id;

	if (!id) {
		return null;
	}

	const parsedQuantity = Number(quantity);
	const itemQuantity =
		Number.isFinite(parsedQuantity) ?
			Math.max(1, Math.floor(parsedQuantity))
		:	1;
	const itemPrice = Number(product.price) || 0;
	const name = product.name ?? product.title ?? "Menu Item";

	return {
		...product,
		id,
		name,
		title: product.title ?? name,
		price: itemPrice,
		quantity: itemQuantity,
	};
};

const withCalculatedTotal = (state) => ({
	...state,
	total: calculateTotal(state.items),
});

const initialState = {
	items: [],
	total: 0,
};

const cartReducer = (state, action) => {
	switch (action.type) {
		case "ADD_ITEM": {
			const payload = normalizeCartItem(
				action.payload.product,
				action.payload.quantity,
			);

			if (!payload) {
				return state;
			}

			const existingItem = state.items.find(
				(item) => String(item.id) === String(payload.id),
			);

			if (existingItem) {
				return withCalculatedTotal({
					...state,
					items: state.items.map((item) =>
						String(item.id) === String(payload.id) ?
							{ ...item, quantity: item.quantity + payload.quantity }
						:	item,
					),
				});
			}

			return withCalculatedTotal({
				...state,
				items: [...state.items, payload],
			});
		}

		case "UPDATE_QUANTITY": {
			const { id, quantity } = action.payload;
			if (quantity < 1) {
				return withCalculatedTotal({
					...state,
					items: state.items.filter((item) => String(item.id) !== String(id)),
				});
			}
			return withCalculatedTotal({
				...state,
				items: state.items.map((item) =>
					String(item.id) === String(id) ? { ...item, quantity } : item,
				),
			});
		}

		case "REMOVE_ITEM":
			return withCalculatedTotal({
				...state,
				items: state.items.filter(
					(item) => String(item.id) !== String(action.payload.id),
				),
			});

		case "CLEAR_CART":
			return initialState;

		case "SET_CART":
			return withCalculatedTotal({
				items: action.payload?.items ?? [],
				total: action.payload?.total ?? 0,
			});

		default:
			return state;
	}
};

export const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	// Load cart from localStorage on mount
	useEffect(() => {
		try {
			const savedCart = localStorage.getItem(CART_STORAGE_KEY);
			if (savedCart) {
				const parsedCart = JSON.parse(savedCart);
				dispatch({ type: "SET_CART", payload: parsedCart });
			}
		} catch (error) {
			console.error("Failed to load cart from localStorage:", error);
			localStorage.removeItem(CART_STORAGE_KEY);
		}
	}, []);

	// Persist cart whenever it changes.
	useEffect(() => {
		try {
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
		} catch (error) {
			console.error("Failed to save cart to localStorage:", error);
		}
	}, [state]);

	// Memoized actions
	const addItem = useCallback((product, quantity = 1) => {
		if (!(product?.id ?? product?._id)) {
			console.error("Product must have an id or _id");
			return;
		}
		dispatch({
			type: "ADD_ITEM",
			payload: { product, quantity: Number(quantity) || 1 },
		});
	}, []);

	const updateQuantity = useCallback((id, quantity) => {
		const parsedQuantity = Number(quantity);
		if (!Number.isFinite(parsedQuantity)) return;
		dispatch({
			type: "UPDATE_QUANTITY",
			payload: { id, quantity: Math.floor(parsedQuantity) },
		});
	}, []);

	const removeItem = useCallback((id) => {
		dispatch({ type: "REMOVE_ITEM", payload: { id } });
	}, []);

	const clearCart = useCallback(() => {
		dispatch({ type: "CLEAR_CART" });
		localStorage.removeItem(CART_STORAGE_KEY);
	}, []);

	const value = {
		items: state.items,
		total: state.total,
		addItem,
		updateQuantity,
		removeItem,
		clearCart,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};
