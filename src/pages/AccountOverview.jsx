import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	ArrowRight,
	CircleAlert,
	Clock3,
	PackageCheck,
	RefreshCw,
	ShoppingBag,
	UserRound,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import StatusBadge from "../components/StatusBadge";
import {
	formatCurrency,
	getOrderDate,
	getOrderDisplayId,
	getOrderTotal,
	getPaymentLabel,
} from "../components/utils";
import { api } from "../utils/api";

const AccountOverview = () => {
	const { user } = useAuth();
	const { items } = useCart();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const shouldReduceMotion = useReducedMotion();

	const loadOrders = async () => {
		setLoading(true);
		setError("");
		try {
			setOrders(await api.getMyOrders());
		} catch (loadError) {
			setError(loadError.message || "We couldn't load your orders.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let active = true;
		api
			.getMyOrders()
			.then((userOrders) => {
				if (active) setOrders(userOrders);
			})
			.catch((loadError) => {
				if (active)
					setError(loadError.message || "We couldn't load your orders.");
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, []);

	const recentOrders = [...orders]
		.sort(
			(a, b) => new Date(getOrderDate(b) || 0) - new Date(getOrderDate(a) || 0),
		)
		.slice(0, 4);
	const pendingCount = orders.filter((order) =>
		["pending", "preparing"].includes(
			(order.status || "pending").toLowerCase(),
		),
	).length;
	const completedCount = orders.filter(
		(order) => order.status === "completed",
	).length;
	const cartCount = items.reduce(
		(count, item) => count + (Number(item.quantity) || 0),
		0,
	);
	const cards = [
		{
			label: "Total orders",
			value: loading ? "—" : orders.length,
			icon: ShoppingBag,
			color: "text-amber-700 bg-amber-50",
		},
		{
			label: "Pending",
			value: loading ? "—" : pendingCount,
			icon: Clock3,
			color: "text-orange-700 bg-orange-50",
		},
		{
			label: "Completed",
			value: loading ? "—" : completedCount,
			icon: PackageCheck,
			color: "text-emerald-700 bg-emerald-50",
		},
		{
			label: "Cart items",
			value: cartCount,
			icon: ShoppingBag,
			color: "text-sky-700 bg-sky-50",
		},
	];

	return (
		<div className="space-y-6">
			<section className="relative overflow-hidden rounded-2xl bg-[#382719] px-5 py-6 text-white sm:px-8 sm:py-8">
				<div className="relative z-10 max-w-xl">
					<p className="text-sm font-semibold text-amber-200">
						Your table is waiting
					</p>
					<h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
						Good food, {user?.fullName?.split(" ")[0] || "good to see you"}.
					</h2>
					<p className="mt-2 max-w-md text-sm leading-relaxed text-stone-200">
						Pick up where you left off and keep an eye on what’s coming from our
						kitchen.
					</p>
					<div className="mt-5 flex flex-wrap gap-3">
						<Link
							to="/services"
							className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-stone-950 transition hover:bg-amber-400">
							Browse menu <ArrowRight className="h-4 w-4" />
						</Link>
						<Link
							to="/account/orders"
							className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
							View orders
						</Link>
						<Link
							to="/account/profile"
							className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
							<UserRound className="h-4 w-4" />
							Manage profile
						</Link>
					</div>
				</div>
				<div
					aria-hidden="true"
					className="absolute -right-10 -top-16 hidden h-64 w-64 rounded-full border-[36px] border-amber-500/15 sm:block"
				/>
			</section>

			<section
				aria-label="Order and cart summary"
				className="grid grid-cols-2 gap-3 xl:grid-cols-4">
				{cards.map(({ label, value, icon: Icon, color }, index) => (
					<motion.div
						key={label}
						initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: shouldReduceMotion ? 0 : 0.24,
							delay: shouldReduceMotion ? 0 : index * 0.04,
						}}
						className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
						<div
							className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
							<Icon className="h-4 w-4" />
						</div>
						<p className="mt-4 text-2xl font-extrabold text-gray-950">
							{value}
						</p>
						<p className="mt-0.5 text-xs font-semibold text-gray-500 sm:text-sm">
							{label}
						</p>
					</motion.div>
				))}
			</section>

			<section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-4 sm:px-6">
					<div>
						<h2 className="text-base font-bold text-gray-950">Recent orders</h2>
						<p className="mt-0.5 text-xs text-gray-500">
							The latest from your order history
						</p>
					</div>
					<Link
						to="/account/orders"
						className="inline-flex items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-800">
						All orders <ArrowRight className="h-4 w-4" />
					</Link>
				</div>
				{loading ?
					<div className="space-y-3 p-5" aria-label="Loading orders">
						<div className="h-14 animate-pulse motion-reduce:animate-none rounded-xl bg-stone-100" />
						<div className="h-14 animate-pulse motion-reduce:animate-none rounded-xl bg-stone-100" />
					</div>
				: error ?
					<div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
						<CircleAlert className="h-7 w-7 text-red-500" />
						<p className="text-sm text-red-700">{error}</p>
						<button
							type="button"
							onClick={loadOrders}
							className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-stone-50">
							<RefreshCw className="h-4 w-4" /> Try again
						</button>
					</div>
				: recentOrders.length === 0 ?
					<div className="px-5 py-10 text-center">
						<ShoppingBag className="mx-auto h-8 w-8 text-stone-300" />
						<p className="mt-3 font-semibold text-gray-900">No orders yet</p>
						<p className="mt-1 text-sm text-gray-500">
							Your next favorite meal is on the menu.
						</p>
						<Link
							to="/services"
							className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-700">
							Explore the menu <ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				:	<div className="divide-y divide-stone-100">
						{recentOrders.map((order, index) => {
							const date = getOrderDate(order);
							const lineItems = (order.items || []).map(
								(item) =>
									`${item.quantity || item.qty || 1} × ${item.productId?.title || item.productId?.name || item.name || "Menu item"}`,
							);
							return (
								<div
									key={order.id || order._id || index}
									className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<p className="font-bold text-gray-900">
												{getOrderDisplayId(order, index)}
											</p>
											<StatusBadge
												status={order.status || "pending"}
												className="px-2.5 py-1 text-xs"
											/>
										</div>
										<p className="mt-1 text-xs text-gray-500">
											{date ?
												new Date(date).toLocaleDateString(undefined, {
													day: "numeric",
													month: "short",
													year: "numeric",
												})
											:	"Date unavailable"}{" "}
											· {lineItems.length}{" "}
											{lineItems.length === 1 ? "item" : "items"}
										</p>
										<p className="mt-1 truncate text-sm text-gray-600">
											{lineItems.join(", ") || "Items unavailable"}
										</p>
									</div>
									<div className="flex items-center justify-between gap-4 sm:justify-end">
										<div className="text-left sm:text-right">
											<p className="font-bold text-gray-900">
												{formatCurrency(getOrderTotal(order))}
											</p>
											<p
												className={`text-xs font-semibold ${order.paymentStatus === "paid" || order.isPaid ? "text-emerald-700" : "text-amber-700"}`}>
												{getPaymentLabel(order)}
											</p>
										</div>
										<Link
											to="/account/orders"
											aria-label={`View order ${getOrderDisplayId(order, index)}`}
											className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 text-gray-600 transition hover:bg-stone-50 hover:text-gray-950">
											<ArrowRight className="h-4 w-4" />
										</Link>
									</div>
								</div>
							);
						})}
					</div>
				}
			</section>
			<p className="sr-only">Signed in as {user?.fullName || user?.email}</p>
		</div>
	);
};

export default AccountOverview;
