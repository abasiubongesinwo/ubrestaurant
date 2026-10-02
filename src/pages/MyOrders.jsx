import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
	Package,
	ChevronDown,
	ChevronUp,
	AlertTriangle,
	RefreshCw,
} from "lucide-react";
import { api } from "../utils/api";
import StatusBadge from "../components/StatusBadge";
import {
	formatCurrency,
	getOrderDisplayId,
	getOrderTotal,
	getOrderDate,
	getPaymentLabel,
	isOrderPaid,
} from "../components/utils";

const STATUS_FILTERS = [
	"all",
	"pending",
	"preparing",
	"completed",
	"cancelled",
];

const MyOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [statusFilter, setStatusFilter] = useState("all");
	const [expanded, setExpanded] = useState({});
	const shouldReduceMotion = useReducedMotion();

	const loadOrders = async () => {
		setLoading(true);
		setError(null);
		try {
			setOrders((await api.getMyOrders()) || []);
		} catch (loadError) {
			console.error("Failed to load your orders:", loadError);
			setError(loadError?.message || "Failed to load your orders.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let active = true;
		api
			.getMyOrders()
			.then((userOrders) => {
				if (active) setOrders(userOrders || []);
			})
			.catch((loadError) => {
				console.error("Failed to load your orders:", loadError);
				if (active)
					setError(loadError?.message || "Failed to load your orders.");
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, []);

	const sortedOrders = [...orders].sort(
		(a, b) => new Date(getOrderDate(b) || 0) - new Date(getOrderDate(a) || 0),
	);

	const filteredOrders =
		statusFilter === "all" ? sortedOrders : (
			sortedOrders.filter(
				(order) => (order.status || "pending") === statusFilter,
			)
		);

	const toggleExpand = (key) =>
		setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

	return (
		<div className="min-h-0 bg-gray-50 px-4 py-7 sm:py-10">
			<div className="mx-auto max-w-5xl">
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
							My Orders
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Track the status of every order you&apos;ve placed.
						</p>
					</div>

					<div className="flex w-full gap-1 overflow-x-auto rounded-2xl bg-gray-100 p-1 sm:w-fit">
						{STATUS_FILTERS.map((status) => (
							<button
								key={status}
								type="button"
								onClick={() => setStatusFilter(status)}
								className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-all ${
									statusFilter === status ?
										"bg-white text-gray-900 shadow-sm"
									:	"text-gray-500 hover:text-gray-800"
								}`}>
								{status}
							</button>
						))}
					</div>
				</div>

				{loading ?
					<div className="space-y-3">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="h-24 animate-pulse motion-reduce:animate-none rounded-2xl bg-gray-100"
							/>
						))}
					</div>
				: error ?
					<div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
						<AlertTriangle className="h-9 w-9 text-red-500" />
						<p className="font-medium text-red-700">{error}</p>
						<button
							type="button"
							onClick={loadOrders}
							className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50">
							<RefreshCw className="h-4 w-4" /> Try Again
						</button>
					</div>
				: filteredOrders.length === 0 ?
					<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
						<Package className="h-10 w-10 text-gray-300" />
						<p className="font-semibold text-gray-900">No orders found</p>
						<p className="text-sm text-gray-500">
							{statusFilter === "all" ?
								"You haven't placed any orders yet."
							:	`You have no ${statusFilter} orders.`}
						</p>
						<Link
							to="/services"
							className="mt-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-700">
							Browse Menu
						</Link>
					</div>
				:	<div className="space-y-4">
						{filteredOrders.map((order, index) => {
							const key = order.id || order._id || index;
							const isOpen = !!expanded[key];
							const orderDate = getOrderDate(order);
							const orderItems = order.items || [];

							return (
								<motion.div
									key={key}
									layout={!shouldReduceMotion}
									initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: shouldReduceMotion ? 0 : 0.28,
										delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.2),
									}}
									className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
									<button
										type="button"
										onClick={() => toggleExpand(key)}
										aria-expanded={isOpen}
										className="flex w-full flex-col gap-3 p-5 text-left sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-center gap-4">
											<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
												<Package className="h-6 w-6" />
											</div>
											<div className="min-w-0">
												<p className="font-bold text-gray-900">
													{getOrderDisplayId(order, index)}
												</p>
												<p className="text-xs text-gray-500">
													{orderDate ?
														new Date(orderDate).toLocaleDateString(undefined, {
															day: "numeric",
															month: "short",
															year: "numeric",
														})
													:	"-"}
													{" · "}
													{orderItems.length} item
													{orderItems.length === 1 ? "" : "s"}
												</p>
											</div>
										</div>

										<div className="flex flex-wrap items-center gap-3 sm:justify-end">
											<span
												className={`text-xs font-semibold ${
													isOrderPaid(order) ? "text-emerald-600" : (
														"text-amber-600"
													)
												}`}>
												{getPaymentLabel(order)}
											</span>
											<span className="font-bold text-gray-900">
												{formatCurrency(getOrderTotal(order))}
											</span>
											<StatusBadge status={order.status || "pending"} />
											{isOpen ?
												<ChevronUp className="h-4 w-4 text-gray-400" />
											:	<ChevronDown className="h-4 w-4 text-gray-400" />}
										</div>
									</button>

									<AnimatePresence initial={false}>
										{isOpen && (
											<motion.div
												initial={
													shouldReduceMotion ? false : { height: 0, opacity: 0 }
												}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{
													duration: shouldReduceMotion ? 0 : 0.22,
												}}
												className="border-t border-gray-100 bg-gray-50/60 px-5 py-4">
												<div className="space-y-2.5">
													{orderItems.map((item, itemIndex) => (
														<div
															key={itemIndex}
															className="flex items-center justify-between gap-3 text-sm">
															<div className="flex min-w-0 items-center gap-3">
																{item.productId?.image && (
																	<img
																		src={item.productId.image}
																		alt={
																			item.productId?.title ||
																			item.productId?.name ||
																			"Menu item"
																		}
																		className="h-10 w-10 shrink-0 rounded-xl border border-gray-100 object-cover"
																	/>
																)}
																<span className="truncate font-semibold text-gray-800">
																	{item.quantity || item.qty || 1}x{" "}
																	{item.productId?.title ||
																		item.productId?.name ||
																		item.name ||
																		"Menu Item"}
																</span>
															</div>
															<span className="shrink-0 font-medium text-gray-500">
																{formatCurrency(
																	(item.price ?? item.productId?.price ?? 0) *
																		(item.quantity || item.qty || 1),
																)}
															</span>
														</div>
													))}

													{orderItems.length === 0 && (
														<p className="text-sm text-gray-500">
															No item details available for this order.
														</p>
													)}

													{order.deliveryAddress && (
														<div className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-500">
															<span className="font-semibold text-gray-700">
																Delivery to:{" "}
															</span>
															{order.deliveryAddress}
														</div>
													)}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							);
						})}
					</div>
				}
			</div>
		</div>
	);
};

export default MyOrders;
