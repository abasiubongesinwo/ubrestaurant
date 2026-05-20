import { useState } from "react";
import { Popup } from "paystack-js";
import { Link } from "react-router-dom";
import {
	ArrowLeft,
	CreditCard,
	ShoppingCart,
	Trash2,
	Truck,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../api";
import Button from "../components/Button";
import CartItem from "../components/CartItem";
import { formatCurrency } from "../components/utils";
import { useAdmin } from "../contexts/AdminContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const PAYSTACK_PLACEHOLDER_KEY = "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx";

const createOrderId = () => {
	const reference = globalThis.crypto?.randomUUID?.();
	return reference ? `order-${reference}` : "order-web-checkout";
};

const isPaymentVerified = (response) =>
	Boolean(
		response?.success ||
		response?.status === "success" ||
		response?.data?.status === "success" ||
		response?.data?.status === true,
	);

const Cart = () => {
	const { items, total, clearCart } = useCart();
	const { addOrder } = useAdmin();
	const { user, isAuthenticated } = useAuth();

	const [customerNameLocal, setCustomerNameLocal] = useState("");
	const [customerEmailLocal, setCustomerEmailLocal] = useState("");
	const [customerPhoneLocal, setCustomerPhoneLocal] = useState("");
	const [customerPhoneSecondaryLocal, setCustomerPhoneSecondaryLocal] =
		useState("");
	const [paymentMode, setPaymentMode] = useState("online");
	const [isProcessing, setIsProcessing] = useState(false);

	// Local raw values – used only when guest checkout
	const customerName =
		isAuthenticated ? user?.fullName || "" : customerNameLocal;
	const customerEmail =
		isAuthenticated ? user?.email || "" : customerEmailLocal;
	const customerPhone =
		isAuthenticated ? user?.phone || "" : customerPhoneLocal;
	const customerPhoneSecondary =
		isAuthenticated ? user?.phoneSecondary || "" : customerPhoneSecondaryLocal;

	const resetCheckoutForm = () => {
		clearCart();
		setCustomerNameLocal("");
		setCustomerEmailLocal("");
		setCustomerPhoneLocal("");
		setCustomerPhoneSecondaryLocal("");
		setPaymentMode("online");
		setIsProcessing(false);
	};

	const placeOrder = async () => {
		const newOrderData = {
			customerName: customerName.trim(),
			customerEmail: customerEmail.trim(),
			customerPhone: customerPhone.trim(),
			customerPhoneSecondary: customerPhoneSecondary.trim(),
			items: items.map((item) => ({
				productId: item.id || item._id,
				quantity: item.quantity || 1,
				price: Number(item.price) || 0,
			})),
			total: Number(total) || 0,
			paymentMode,
			date: new Date().toISOString(),
			deliveryMode: "delivery",
		};

		const orderCreatedResponse = await addOrder(newOrderData);
		
		console.log("Order created in admin context:", orderCreatedResponse);

		toast.success("Order placed successfully!", {
			description: "We will contact you shortly to confirm details.",
		});

		resetCheckoutForm();
	window.location.href=orderCreatedResponse?.paymentUrl||"/orders"; // Redirect to payment URL or orders page
	};

	// const handleOnlineCheckout = async () => {
	// 	const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

	// 	if (
	// 		!paystackKey ||
	// 		paystackKey === PAYSTACK_PLACEHOLDER_KEY ||
	// 		!paystackKey.startsWith("pk_")
	// 	) {
	// 		toast.error("Paystack public key is not configured yet.");
	// 		setIsProcessing(false);
	// 		return;
	// 	}

	// 	const amountKobo = Math.max(0, Math.round((Number(total) || 0) * 100));
	// 	const orderId = createOrderId();

	// 	const response = await api.initializePayment({
	// 		email: customerEmail.trim(),
	// 		amount: amountKobo,
	// 		orderId,
	// 	});

	// 	const reference =
	// 		response?.data?.reference ??
	// 		response?.reference ??
	// 		response?.data?.access_code ??
	// 		response?.access_code;

	// 	if (!reference) {
	// 		toast.error("Failed to initialize payment");
	// 		setIsProcessing(false);
	// 		return;
	// 	}

	// 	const popup = new Popup({
	// 		key: paystackKey,
	// 		email: customerEmail.trim(),
	// 		amount: amountKobo,
	// 		ref: reference,
	// 		callback: async (transaction) => {
	// 			try {
	// 				const verifyResponse = await api.verifyPayment(transaction.reference);

	// 				if (!isPaymentVerified(verifyResponse)) {
	// 					toast.error("Payment verification failed");
	// 					setIsProcessing(false);
	// 					return;
	// 				}

	// 				await placeOrder();
	// 			} catch (error) {
	// 				console.error("Payment verification failed:", error);
	// 				toast.error("Payment verification failed");
	// 				setIsProcessing(false);
	// 			}
	// 		},
	// 		onClose: () => {
	// 			toast.error("Payment cancelled");
	// 			setIsProcessing(false);
	// 		},
	// 	});

	// 	popup.open();
	// };

	const handleCheckout = async () => {
		if (items.length === 0) {
			return;
		}

		// Skip name/email validation for authenticated users
		if (!isAuthenticated) {
			if (!customerName.trim() || !customerEmail.trim()) {
				toast.error("Please enter your full name and email address");
				return;
			}

			if (!EMAIL_PATTERN.test(customerEmail.trim())) {
				toast.error("Please enter a valid email address");
				return;
			}
		}

		// Validate phone numbers for all users
		// if (!customerPhone.trim()) {
		// 	toast.error("Please enter your primary phone number");
		// 	return;
		// }

		// if (!customerPhoneSecondary.trim()) {
		// 	toast.error("Please enter your secondary phone number");
		// 	return;
		// }

		setIsProcessing(true);

		try {
			// if (paymentMode === "online") {
			// 	await handleOnlineCheckout();
			// 	return;
			// }

			await placeOrder();
		
		} catch (error) {
			console.error("Checkout failed:", error);
			toast.error("Failed to process checkout. Please try again.");
			setIsProcessing(false);
		}
	};

	if (items.length === 0) {
		return (
			<div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-gray-50">
				<div className="text-center max-w-md">
					<div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
						<ShoppingCart className="w-16 h-16 text-gray-400" />
					</div>

					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Your cart is empty
					</h2>
					<p className="text-xl text-gray-600 mb-10">
						Add meals to your order and checkout quickly.
					</p>

					<Button
						asLink
						to="/services"
						size="lg"
						className="px-12 py-4 text-lg">
						Browse Menu
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-20 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center gap-4 mb-10">
					<Link
						to="/services"
						className="p-3 hover:bg-white rounded-2xl transition-colors">
						<ArrowLeft className="w-6 h-6 text-gray-700" />
					</Link>
					<div>
						<h1 className="text-4xl font-bold text-gray-900">Your Order</h1>
						<p className="text-gray-600 mt-1">
							{items.length} item{items.length > 1 ? "s" : ""}
						</p>
					</div>
				</div>

				<div className="grid lg:grid-cols-12 gap-8">
					<div className="lg:col-span-7 space-y-6">
						{items.map((item, index) => (
							<CartItem
								key={item.id || item._id || item.title || index}
								{...item}
							/>
						))}
					</div>

					<div className="lg:col-span-5 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:sticky lg:top-24">
						<h3 className="text-2xl font-bold text-gray-900 mb-8">
							Order Summary
						</h3>

						<div className="space-y-4 mb-10">
							<div className="flex justify-between text-lg">
								<span className="text-gray-600">Subtotal</span>
								<span className="font-semibold">{formatCurrency(total)}</span>
							</div>
							<div className="flex justify-between text-lg">
								<span className="text-gray-600">Delivery Fee</span>
								<span className="text-emerald-600 font-medium">Free</span>
							</div>
							<div className="border-t pt-4 flex justify-between text-2xl font-bold">
								<span>Total</span>
								<span className="text-amber-600">{formatCurrency(total)}</span>
							</div>
						</div>

						<div className="space-y-6 mb-8">
							{!isAuthenticated && (
								<>
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Full Name <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											value={customerNameLocal}
											onChange={(event) =>
												setCustomerNameLocal(event.target.value)
											}
											className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
										/>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Email Address <span className="text-red-500">*</span>
										</label>
										<input
											type="email"
											value={customerEmailLocal}
											onChange={(event) =>
												setCustomerEmailLocal(event.target.value)
											}
											className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
										/>
									</div>
								</>
							)}

							{isAuthenticated && (
								<div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
											<span className="text-green-600 font-semibold text-sm">
												✓
											</span>
										</div>
										<div>
											<p className="font-medium text-green-800">
												{user?.fullName}
											</p>
											<p className="text-sm text-green-600">{user?.email}</p>
										</div>
									</div>
								</div>
							)}

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Primary Phone Number <span className="text-red-500">*</span>
								</label>
								<input
									type="tel"
									value={customerPhoneLocal}
									onChange={(event) =>
										setCustomerPhoneLocal(event.target.value)
									}
									placeholder="+234 or 0801..."
									className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Secondary Phone Number <span className="text-red-500">*</span>
								</label>
								<input
									type="tel"
									value={customerPhoneSecondaryLocal}
									onChange={(event) =>
										setCustomerPhoneSecondaryLocal(event.target.value)
									}
									placeholder="Backup number for delivery"
									className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Payment method
								</label>
								<select
									value={paymentMode}
									onChange={(event) => setPaymentMode(event.target.value)}
									className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all">
									<option value="online">Pay Online</option>
									<option value="cod">Cash on Delivery</option>
								</select>
							</div>
						</div>

						<div className="space-y-4">
							<Button
								size="lg"
								className="w-full py-4 text-lg font-semibold flex items-center justify-center gap-3"
								onClick={handleCheckout}
								disabled={isProcessing}>
								{isProcessing ?
									"Placing Order..."
								:	<>
										<CreditCard className="w-5 h-5" />
										{paymentMode === "cod" ?
											"Place Order"
										:	"Place Order and Checkout"}
									</>
								}
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="w-full py-4 text-lg flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
								onClick={clearCart}>
								<Trash2 className="w-5 h-5" />
								Clear Entire Cart
							</Button>
						</div>

						<div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
							<div className="flex items-center gap-1.5">
								<Truck className="w-4 h-4" />
								<span>Free Delivery</span>
							</div>
							<div className="h-1 w-1 bg-gray-300 rounded-full" />
							<span>Online and offline payment</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
