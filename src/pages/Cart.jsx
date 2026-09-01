import { useState } from "react";
import { Link } from "react-router-dom";
import {
	ArrowLeft,
	CreditCard,
	ShoppingCart,
	Trash2,
	Truck,
	ShieldCheck,
	MapPin,
	User,
	Phone,
	Mail,
	WalletCards,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "../utils/api";
import Button from "../components/Button";
import CartItem from "../components/CartItem";
import { formatCurrency } from "../components/utils";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const EMAIL_PATTERN = /\S+@\S+\.\S+/;

const PHONE_PATTERN = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;

const Cart = () => {
	const { items, total, clearCart } = useCart();
	const { user, isAuthenticated } = useAuth();

	const [customerNameLocal, setCustomerNameLocal] = useState("");
	const [customerEmailLocal, setCustomerEmailLocal] = useState("");
	const [customerPhoneLocal, setCustomerPhoneLocal] = useState("");
	const [customerPhoneSecondaryLocal, setCustomerPhoneSecondaryLocal] =
		useState("");
	const [deliveryAddressLocal, setDeliveryAddressLocal] = useState("");
	const [paymentMode, setPaymentMode] = useState("online");
	const [isProcessing, setIsProcessing] = useState(false);

	// =====================================================
	// CUSTOMER DATA
	// =====================================================

	const customerName =
		customerNameLocal.trim() || (isAuthenticated ? user?.fullName || "" : "");

	const customerEmail =
		customerEmailLocal.trim() || (isAuthenticated ? user?.email || "" : "");

	const customerPhone =
		customerPhoneLocal.trim() ||
		(isAuthenticated ? user?.phone || user?.phoneNumber || "" : "");

	const customerPhoneSecondary =
		customerPhoneSecondaryLocal.trim() ||
		(isAuthenticated ? user?.phoneSecondary || "" : "");

	const deliveryAddress =
		deliveryAddressLocal.trim() ||
		(isAuthenticated ? user?.address || user?.deliveryAddress || "" : "");

	// =====================================================
	// RESET
	// =====================================================

	const resetCheckoutForm = () => {
		clearCart();

		setCustomerNameLocal("");
		setCustomerEmailLocal("");
		setCustomerPhoneLocal("");
		setCustomerPhoneSecondaryLocal("");
		setDeliveryAddressLocal("");
		setPaymentMode("online");
		setIsProcessing(false);
	};

	// =====================================================
	// PLACE ORDER
	// =====================================================

	const placeOrder = async () => {
		const newOrderData = {
			customerName: customerName.trim(),
			customerEmail: customerEmail.trim(),
			customerPhone: customerPhone.trim(),
			customerPhoneSecondary: customerPhoneSecondary.trim(),
			deliveryAddress: deliveryAddress.trim(),

			items: items.map((item) => ({
				productId: item.id || item._id,
				quantity: item.quantity || 1,
			})),

			paymentMode,
		};

		const orderCreatedResponse = await api.createOrder(newOrderData);

		console.log("Order created successfully:", orderCreatedResponse);

		resetCheckoutForm();

		// Cash on delivery
		if (paymentMode === "cod") {
			toast.success("Order placed successfully!", {
				description: "Your cash-on-delivery order has been received.",
			});

			window.location.href = "/services";
			return;
		}

		// Online payment
		toast.success("Order placed successfully!", {
			description: "Redirecting you to the secure payment screen...",
		});

		if (orderCreatedResponse?.paymentUrl) {
			window.location.href = orderCreatedResponse.paymentUrl;
		} else {
			window.location.href = "/services";
		}
	};

	// =====================================================
	// CHECKOUT VALIDATION
	// =====================================================

	const handleCheckout = async () => {
		if (items.length === 0) return;

		if (!isAuthenticated) {
			if (!customerName.trim() || !customerEmail.trim()) {
				toast.error("Please enter your full name and email address.");
				return;
			}

			if (!EMAIL_PATTERN.test(customerEmail.trim())) {
				toast.error("Please enter a valid email address.");
				return;
			}
		}

		if (!customerPhone.trim()) {
			toast.error("Primary phone number is required.");
			return;
		}

		if (
			customerPhone.trim().length < 7 ||
			!PHONE_PATTERN.test(customerPhone.trim())
		) {
			toast.error("Please enter a valid primary phone number.");
			return;
		}

		if (!deliveryAddress.trim()) {
			toast.error("Please enter your delivery address.");
			return;
		}

		if (deliveryAddress.trim().length < 10) {
			toast.error("Please enter a complete delivery address.");
			return;
		}

		setIsProcessing(true);

		try {
			await placeOrder();
		} catch (error) {
			console.error("Checkout failed:", error);

			toast.error(
				error?.message || "Failed to process checkout. Please try again.",
			);

			setIsProcessing(false);
		}
	};

	// =====================================================
	// EMPTY CART
	// =====================================================

	if (items.length === 0) {
		return (
			<div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4 py-16">
				<div className="w-full max-w-md text-center">
					<div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
						<ShoppingCart className="h-11 w-11 text-amber-600" />
					</div>

					<h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
						Your cart is empty
					</h1>

					<p className="mt-3 text-gray-600 leading-relaxed">
						You haven't added any meals yet. Browse our menu and choose
						something delicious.
					</p>

					<Link
						to="/services"
						className="mt-8 inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-amber-600 px-8 py-4 font-bold text-white shadow-lg shadow-amber-600/20 transition hover:bg-amber-700 active:scale-[0.98]">
						Browse Menu
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* =====================================================
			    PAGE HEADER
			===================================================== */}

			<div className="border-b border-gray-100 bg-white">
				<div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						<Link
							to="/services"
							className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-gray-200">
							<ArrowLeft className="h-5 w-5" />
						</Link>

						<div>
							<h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
								Your Order
							</h1>

							<p className="mt-0.5 text-sm text-gray-500">
								{items.length} {items.length === 1 ? "item" : "items"} in your
								cart
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* =====================================================
			    MAIN CONTENT
			===================================================== */}

			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
					{/* =================================================
					    LEFT SIDE - CART ITEMS
					================================================= */}

					<section className="lg:col-span-7">
						<div className="mb-4 flex items-center justify-between">
							<div>
								<h2 className="text-lg sm:text-xl font-bold text-gray-900">
									Your Items
								</h2>

								<p className="text-sm text-gray-500">
									Review your meals before checkout.
								</p>
							</div>

							<span className="rounded-full bg-amber-100 px-3 py-1 text-xs sm:text-sm font-bold text-amber-700">
								{items.length} items
							</span>
						</div>

						<div className="space-y-4">
							{items.map((item, index) => (
								<CartItem
									key={item.id || item._id || item.title || index}
									{...item}
								/>
							))}
						</div>

						{/* Continue Shopping */}
						<Link
							to="/services"
							className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-700">
							<ArrowLeft className="h-4 w-4" />
							Continue shopping
						</Link>
					</section>

					{/* =================================================
					    RIGHT SIDE - CHECKOUT
					================================================= */}

					<aside className="lg:col-span-5">
						<div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg lg:sticky lg:top-24">
							{/* Checkout Header */}
							<div className="border-b border-gray-100 px-5 py-5 sm:px-7">
								<div className="flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100">
										<WalletCards className="h-5 w-5 text-amber-600" />
									</div>

									<div>
										<h2 className="text-xl font-bold text-gray-900">
											Checkout
										</h2>

										<p className="text-sm text-gray-500">
											Complete your order details
										</p>
									</div>
								</div>
							</div>

							<div className="p-5 sm:p-7">
								{/* =================================================
								    ORDER SUMMARY
								================================================= */}

								<div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-600">Subtotal</span>

										<span className="font-semibold text-gray-900">
											{formatCurrency(total)}
										</span>
									</div>

									<div className="mt-3 flex items-center justify-between text-sm">
										<span className="text-gray-600">Delivery</span>

										<span className="font-semibold text-emerald-600">Free</span>
									</div>

									<div className="my-4 border-t border-gray-200" />

									<div className="flex items-center justify-between">
										<span className="text-base font-bold text-gray-900">
											Total
										</span>

										<span className="text-xl sm:text-2xl font-extrabold text-amber-600">
											{formatCurrency(total)}
										</span>
									</div>
								</div>

								{/* =================================================
								    CUSTOMER INFORMATION
								================================================= */}

								<div className="mt-7">
									<div className="mb-4">
										<h3 className="text-base font-bold text-gray-900">
											Customer Information
										</h3>

										<p className="mt-1 text-xs text-gray-500">
											We use these details to deliver your order.
										</p>
									</div>

									<div className="space-y-4">
										{/* Guest Name */}
										{!isAuthenticated && (
											<div>
												<label className="mb-1.5 block text-sm font-semibold text-gray-700">
													Full Name <span className="text-red-500">*</span>
												</label>

												<div className="relative">
													<User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

													<input
														type="text"
														value={customerNameLocal}
														onChange={(event) =>
															setCustomerNameLocal(event.target.value)
														}
														placeholder="Enter your full name"
														className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
													/>
												</div>
											</div>
										)}

										{/* Guest Email */}
										{!isAuthenticated && (
											<div>
												<label className="mb-1.5 block text-sm font-semibold text-gray-700">
													Email Address <span className="text-red-500">*</span>
												</label>

												<div className="relative">
													<Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

													<input
														type="email"
														value={customerEmailLocal}
														onChange={(event) =>
															setCustomerEmailLocal(event.target.value)
														}
														placeholder="you@example.com"
														className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
													/>
												</div>
											</div>
										)}

										{/* Authenticated User */}
										{isAuthenticated && (
											<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
														<User className="h-5 w-5 text-emerald-600" />
													</div>

													<div className="min-w-0">
														<p className="truncate text-sm font-bold text-emerald-900">
															{user?.fullName}
														</p>

														<p className="truncate text-xs text-emerald-700">
															{user?.email}
														</p>
													</div>

													<div className="ml-auto text-emerald-600">
														<ShieldCheck className="h-5 w-5" />
													</div>
												</div>
											</div>
										)}

										{/* Primary Phone */}
										{(!isAuthenticated ||
											!(user?.phone || user?.phoneNumber)) && (
											<div>
												<label className="mb-1.5 block text-sm font-semibold text-gray-700">
													Primary Phone <span className="text-red-500">*</span>
												</label>

												<div className="relative">
													<Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

													<input
														type="tel"
														value={customerPhoneLocal}
														onChange={(event) =>
															setCustomerPhoneLocal(event.target.value)
														}
														placeholder="08012345678"
														className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
													/>
												</div>
											</div>
										)}

										{/* Secondary Phone */}
										{(!isAuthenticated || !user?.phoneSecondary) && (
											<div>
												<label className="mb-1.5 block text-sm font-semibold text-gray-700">
													Secondary Phone{" "}
													<span className="font-normal text-gray-400">
														(Optional)
													</span>
												</label>

												<div className="relative">
													<Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

													<input
														type="tel"
														value={customerPhoneSecondaryLocal}
														onChange={(event) =>
															setCustomerPhoneSecondaryLocal(event.target.value)
														}
														placeholder="Backup number"
														className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
													/>
												</div>
											</div>
										)}

										{/* Delivery Address */}
										{(!isAuthenticated ||
											!(user?.address || user?.deliveryAddress)) && (
											<div>
												<label className="mb-1.5 block text-sm font-semibold text-gray-700">
													Delivery Address{" "}
													<span className="text-red-500">*</span>
												</label>

												<div className="relative">
													<MapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-gray-400" />

													<textarea
														rows={4}
														value={deliveryAddressLocal}
														onChange={(event) =>
															setDeliveryAddressLocal(event.target.value)
														}
														placeholder="House number, street, area, city..."
														className="w-full resize-none rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
													/>
												</div>
											</div>
										)}

										{/* Payment Method */}
										<div>
											<label className="mb-1.5 block text-sm font-semibold text-gray-700">
												Payment Method
											</label>

											<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
												<button
													type="button"
													onClick={() => setPaymentMode("online")}
													className={`rounded-xl border p-4 text-left transition ${
														paymentMode === "online" ?
															"border-amber-500 bg-amber-50 ring-2 ring-amber-100"
														:	"border-gray-200 bg-white hover:border-gray-300"
													}`}>
													<div className="flex items-center gap-3">
														<div
															className={`flex h-9 w-9 items-center justify-center rounded-lg ${
																paymentMode === "online" ? "bg-amber-100" : (
																	"bg-gray-100"
																)
															}`}>
															<CreditCard
																className={`h-4 w-4 ${
																	paymentMode === "online" ? "text-amber-600"
																	:	"text-gray-500"
																}`}
															/>
														</div>

														<div>
															<p className="text-sm font-bold text-gray-900">
																Pay Online
															</p>

															<p className="text-xs text-gray-500">
																Pay securely
															</p>
														</div>
													</div>
												</button>

												<button
													type="button"
													onClick={() => setPaymentMode("cod")}
													className={`rounded-xl border p-4 text-left transition ${
														paymentMode === "cod" ?
															"border-amber-500 bg-amber-50 ring-2 ring-amber-100"
														:	"border-gray-200 bg-white hover:border-gray-300"
													}`}>
													<div className="flex items-center gap-3">
														<div
															className={`flex h-9 w-9 items-center justify-center rounded-lg ${
																paymentMode === "cod" ? "bg-amber-100" : (
																	"bg-gray-100"
																)
															}`}>
															<WalletCards
																className={`h-4 w-4 ${
																	paymentMode === "cod" ? "text-amber-600" : (
																		"text-gray-500"
																	)
																}`}
															/>
														</div>

														<div>
															<p className="text-sm font-bold text-gray-900">
																Cash on Delivery
															</p>

															<p className="text-xs text-gray-500">
																Pay when delivered
															</p>
														</div>
													</div>
												</button>
											</div>
										</div>
									</div>
								</div>

								{/* =================================================
								    ACTION BUTTONS
								================================================= */}

								<div className="mt-7 space-y-3">
									<Button
										size="lg"
										onClick={handleCheckout}
										disabled={isProcessing}
										className="w-full rounded-2xl py-4 text-base font-bold shadow-lg shadow-amber-600/20">
										{isProcessing ?
											<span className="flex items-center justify-center gap-2">
												<span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
												Processing...
											</span>
										:	<span className="flex items-center justify-center gap-2">
												<CreditCard className="h-5 w-5" />

												{paymentMode === "cod" ?
													"Place Order"
												:	"Place Order & Pay"}
											</span>
										}
									</Button>

									<button
										type="button"
										onClick={clearCart}
										disabled={isProcessing}
										className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
										<Trash2 className="h-4 w-4" />
										Clear Entire Cart
									</button>
								</div>

								{/* =================================================
								    TRUST INFORMATION
								================================================= */}

								<div className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
									<div className="flex items-center gap-2 text-xs text-gray-500">
										<Truck className="h-4 w-4 shrink-0 text-emerald-600" />
										<span>Free delivery</span>
									</div>

									<div className="flex items-center gap-2 text-xs text-gray-500">
										<ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
										<span>Secure checkout</span>
									</div>
								</div>
							</div>
						</div>
					</aside>
				</div>
			</main>
		</div>
	);
};

export default Cart;
