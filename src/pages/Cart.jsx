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
		};

		const orderCreatedResponse = await api.createOrder(newOrderData);

		console.log("Order created successfully:", orderCreatedResponse);

		toast.success("Order placed successfully!", {
			description: "Redirecting you to the secure payment screen...",
		});

		resetCheckoutForm();

		// Handle Paystack payment redirect
		if (orderCreatedResponse?.paymentUrl) {
			window.location.href = orderCreatedResponse.paymentUrl;
		} else {
			window.location.href = "/orders";
		}
	};

	const handleCheckout = async () => {
		if (items.length === 0) {
			return;
		}

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

		setIsProcessing(true);

		try {
			await placeOrder();
		} catch (error) {
			console.error("Checkout failed:", error);
			toast.error("Failed to process checkout. Please try again.");
			setIsProcessing(false);
		}
	};

	if (items.length === 0) {
		return (
			<div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:py-20 bg-gray-50">
				<div className="text-center max-w-md w-full">
					<div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
						<ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
					</div>

					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
						Your cart is empty
					</h2>
					<p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10">
						Add meals to your order and checkout quickly.
					</p>

					<Button
						asLink
						to="/services"
						size="lg"
						className="w-full sm:w-auto px-12 py-4 text-lg">
						Browse Menu
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-10 sm:py-20 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header Section */}
				<div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
					<Link
						to="/services"
						className="p-2 sm:p-3 hover:bg-white rounded-2xl transition-colors bg-gray-100 sm:bg-transparent">
						<ArrowLeft className="w-5 h-5 sm:w-6 h-6 text-gray-700" />
					</Link>
					<div>
						<h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
							Your Order
						</h1>
						<p className="text-sm sm:text-gray-600 mt-0.5">
							{items.length} item{items.length > 1 ? "s" : ""}
						</p>
					</div>
				</div>

				{/* ⚡ FIX: Added grid-cols-1 to force items to stack cleanly down like a column on small devices */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:grid-cols-1 sm:gap-8 w-full">
					{/* Cart Items List Wrapper */}
					<div className="lg:col-span-7 space-y-4 sm:space-y-6 w-full">
						{items.map((item, index) => (
							<CartItem
								key={item.id || item._id || item.title || index}
								{...item}
							/>
						))}
					</div>

					{/* Order Summary Checkout Box */}
					{/* ⚡ FIX: Optimized padding for mobile devices (p-5 on mobile, p-8 on desktop) */}
					<div className="lg:col-span-5 bg-white rounded-3xl shadow-xl border border-gray-100 p-5 sm:p-8 lg:sticky lg:top-24 h-fit w-full">
						<h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
							Order Summary
						</h3>

						<div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
							<div className="flex justify-between text-base sm:text-lg">
								<span className="text-gray-600">Subtotal</span>
								<span className="font-semibold">{formatCurrency(total)}</span>
							</div>
							<div className="flex justify-between text-base sm:text-lg">
								<span className="text-gray-600">Delivery Fee</span>
								<span className="text-emerald-600 font-medium">Free</span>
							</div>
							<div className="border-t pt-3 sm:pt-4 flex justify-between text-xl sm:text-2xl font-bold">
								<span>Total</span>
								<span className="text-amber-600">{formatCurrency(total)}</span>
							</div>
						</div>

						{/* Customer Information Form Fields */}
						<div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
							{!isAuthenticated && (
								<>
									<div>
										<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
											Full Name <span className="text-red-500">*</span>
										</label>
										<input
											type="text"
											value={customerNameLocal}
											onChange={(event) =>
												setCustomerNameLocal(event.target.value)
											}
											className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all text-sm sm:text-base"
										/>
									</div>

									<div>
										<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
											Email Address <span className="text-red-500">*</span>
										</label>
										<input
											type="email"
											value={customerEmailLocanl}
											onChange={(event) =>
												setCustomerEmailLocal(event.target.value)
											}
											className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all text-sm sm:text-base"
										/>
									</div>
								</>
							)}

							{isAuthenticated && (
								<div className="bg-green-50 border border-green-200 rounded-2xl p-3 sm:p-4 mb-4">
									<div className="flex items-center gap-2 sm:gap-3">
										<div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
											<span className="text-green-600 font-semibold text-xs sm:text-sm">
												✓
											</span>
										</div>
										<div className="min-w-0 flex-1">
											<p className="font-medium text-green-800 text-sm sm:text-base truncate">
												{user?.fullName}
											</p>
											<p className="text-xs sm:text-sm text-green-600 truncate">
												{user?.email}
											</p>
										</div>
									</div>
								</div>
							)}

							<div>
								<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
									Primary Phone Number <span className="text-red-500">*</span>
								</label>
								<input
									type="tel"
									value={customerPhoneLocal}
									onChange={(event) =>
										setCustomerPhoneLocal(event.target.value)
									}
									placeholder="+234 or 0801..."
									className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all text-sm sm:text-base"
								/>
							</div>

							<div>
								<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
									Secondary Phone Number <span className="text-red-500">*</span>
								</label>
								<input
									type="tel"
									value={customerPhoneSecondaryLocal}
									onChange={(event) =>
										setCustomerPhoneSecondaryLocal(event.target.value)
									}
									placeholder="Backup number for delivery"
									className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all text-sm sm:text-base"
								/>
							</div>

							<div>
								<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
									Payment method
								</label>
								<select
									value={paymentMode}
									onChange={(event) => setPaymentMode(event.target.value)}
									className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all text-sm sm:text-base bg-white">
									<option value="online">Pay Online</option>
								</select>
							</div>
						</div>

						{/* Order Confirmation CTA Buttons */}
						<div className="space-y-3 sm:space-y-4">
							<Button
								size="lg"
								className="w-full py-3.5 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 sm:gap-3"
								onClick={handleCheckout}
								disabled={isProcessing}>
								{isProcessing ?
									"Placing Order..."
								:	<>
										<CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
										{paymentMode === "cod" ?
											"Place Order"
										:	"Place Order and Checkout"}
									</>
								}
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="w-full py-3.5 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
								onClick={clearCart}>
								<Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
								Clear Entire Cart
							</Button>
						</div>

						{/* Trust Badges */}
						<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 text-xs sm:text-sm text-gray-500">
							<div className="flex items-center gap-1.5">
								<Truck className="w-4 h-4" />
								<span>Free Delivery</span>
							</div>
							<div className="hidden sm:block h-1 w-1 bg-gray-300 rounded-full" />
							<span>Online and offline payment</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
