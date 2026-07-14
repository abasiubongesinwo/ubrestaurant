import { useState } from "react";
import { motion } from "framer-motion";
import {
	ChevronDown,
	ChevronUp,
	Filter,
	Package,
	Search,
	Mail,
	Phone,
} from "lucide-react";
import { useAdmin } from "../contexts/AdminContext";
import { formatCurrency } from "./utils";

const getOrderDisplayId = (order, index) => {
	const rawId = order.id ?? order._id ?? index + 1;
	const idAsString = String(rawId);

	return /^\d+$/.test(idAsString) ?
			`#${idAsString.padStart(4, "0")}`
		:	`#${idAsString.slice(-8).toUpperCase()}`;
};

const OrderTable = ({ orders: sourceOrders }) => {
	const { orders: adminOrders, updateOrderStatus } = useAdmin();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [expandedOrders, setExpandedOrders] = useState({});

	const orders = sourceOrders ?? adminOrders;

	const toggleOrderExpand = (orderId, e) => {
		if (e) e.stopPropagation();
		setExpandedOrders((prev) => ({
			...prev,
			[orderId]: !prev[orderId],
		}));
	};

	const filteredOrders = orders.filter((order) => {
		const customerName =
			order.customerName?.toLowerCase() ||
			order.user?.fullName?.toLowerCase() ||
			order.user?.fullname ||
			"";
		const customerEmail =
			order.customerEmail?.toLowerCase() ||
			order.user?.email?.toLowerCase() ||
			"";

		const primaryPhone =
			order.customerPhone || order.user?.phone || order.user?.phoneNumber || "";
		const secondaryPhone = order.customerPhoneSecondary || "";

		const query = search.toLowerCase();

		const matchesSearch =
			customerName.includes(query) ||
			customerEmail.includes(query) ||
			primaryPhone.includes(query) ||
			secondaryPhone.includes(query);

		const matchesStatus =
			statusFilter === "all" || order.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const statusOptions = ["all", "pending", "preparing", "completed"];

	const handleStatusChange = (id, newStatus) => {
		updateOrderStatus(id, newStatus);
	};

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div className="flex flex-col lg:flex-row gap-4 mb-8">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search by name, email, or phone number..."
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all"
					/>
				</div>
				<div className="relative">
					<select
						value={statusFilter}
						onChange={(event) => setStatusFilter(event.target.value)}
						className="appearance-none bg-white border border-gray-200 rounded-2xl pl-12 pr-10 py-4 focus:ring-4 focus:ring-amber-200 focus:border-amber-500 cursor-pointer">
						{statusOptions.map((option) => (
							<option key={option} value={option}>
								{option.charAt(0).toUpperCase() + option.slice(1)}
							</option>
						))}
					</select>
					<Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
					<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
				</div>
			</div>

			<div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-50/50 border-b border-gray-100">
								<th className="px-8 py-6 text-lg font-bold text-gray-900">
									Order
								</th>
								<th className="px-6 py-6 text-lg font-semibold text-gray-900">
									Customer Details
								</th>
								<th className="px-6 py-6 text-lg font-semibold text-gray-900">
									Items Ordered
								</th>
								<th className="px-6 py-6 text-right text-lg font-semibold text-gray-900">
									Total
								</th>
								<th className="px-6 py-6 text-lg font-semibold text-gray-900">
									Status
								</th>
								<th className="px-6 py-6 text-lg font-semibold text-gray-900">
									Date
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{filteredOrders.map((order, index) => {
								const orderId = order.id || order._id || index;
								const isExpanded = !!expandedOrders[orderId];
								const rawItems = order.items || [];
								const totalDistinctItems = rawItems.length;

								const itemsToRender =
									isExpanded ? rawItems : rawItems.slice(0, 1);

								return (
									<motion.tr
										key={orderId || `${order.customerEmail}-${index}`}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										onClick={(e) => toggleOrderExpand(orderId, e)}
										className="hover:bg-gray-50/70 transition-colors cursor-pointer">
										<td className="px-8 py-6 font-bold text-amber-600 vertical-align-top">
											{getOrderDisplayId(order, index)}
										</td>
										<td className="px-6 py-6 max-w-xs">
											<div
												className="space-y-1.5"
												onClick={(e) => e.stopPropagation()}>
												<div className="font-bold text-gray-900">
													{order.customerName ||
														order.user?.fullName ||
														order.user?.fullname ||
														"Guest Customer"}
												</div>
												<div className="text-xs text-gray-500 flex items-center gap-1.5 break-all">
													<Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
													{order.customerEmail ||
														order.user?.email ||
														"No email"}
												</div>

												{/* 📞 Primary Phone Row */}
												<div className="text-xs text-gray-700 font-medium flex items-center gap-1.5">
													<Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
													{order.customerPhone ||
														order.user?.phone ||
														order.user?.phoneNumber ||
														"No phone number"}
												</div>
												{/* 📱 Optional Secondary Phone Row */}
												{order.customerPhoneSecondary && (
													<div className="text-[11px] text-gray-500 flex items-center gap-1.5 pl-5 bg-gray-50 py-0.5 px-1.5 rounded w-max border border-gray-100">
														<span className="font-semibold text-gray-800">
															Alt:
														</span>
														{order.customerPhoneSecondary}
													</div>
												)}
											</div>
										</td>

										<td className="px-6 py-6">
											<div className="flex flex-col gap-2.5">
												{itemsToRender.map((item, itemIndex) => (
													<div
														key={itemIndex}
														className="flex items-center gap-3 text-sm text-gray-600">
														{item.productId?.image && (
															<img
																src={item.productId.image}
																alt="Product"
																className="w-10 h-10 object-cover rounded-xl border border-gray-100 shadow-sm"
															/>
														)}
														<div className="flex flex-col">
															<span className="font-semibold text-gray-900">
																{item.quantity || item.qty || 1}x{" "}
																{item.productId?.name ||
																	item.productId?.title ||
																	item.name ||
																	"Menu Item"}
															</span>
															<span className="text-xs text-gray-400">
																{formatCurrency(
																	item.price || item.productId?.price || 0,
																)}{" "}
																each
															</span>
														</div>
													</div>
												))}

												{/* Hidden Counter Badges toggles */}
												{!isExpanded && totalDistinctItems > 1 && (
													<button
														onClick={(e) => toggleOrderExpand(orderId, e)}
														className="text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 px-2.5 py-1 rounded-lg w-max flex items-center gap-1 mt-1 transition-all">
														+ {totalDistinctItems - 1} more items
														<ChevronDown className="w-3 h-3" />
													</button>
												)}

												{isExpanded && totalDistinctItems > 1 && (
													<button
														onClick={(e) => toggleOrderExpand(orderId, e)}
														className="text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg w-max flex items-center gap-1 mt-1 transition-all">
														Show less
														<ChevronUp className="w-3 h-3" />
													</button>
												)}
											</div>
										</td>
										<td className="px-6 py-6 text-right">
											<div className="text-lg font-extrabold text-gray-900">
												{formatCurrency(order.totalAmount || order.total || 0)}
											</div>
										</td>
										<td
											className="px-6 py-6"
											onClick={(e) => e.stopPropagation()}>
											<select
												value={order.status || "pending"}
												onChange={(event) =>
													handleStatusChange(
														order.id ?? order._id,
														event.target.value,
													)
												}
												className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 cursor-pointer font-medium text-sm shadow-sm">
												<option value="pending">Pending</option>
												<option value="preparing">Preparing</option>
												<option value="completed">Completed</option>
											</select>
										</td>
										<td className="px-6 py-6 text-sm text-gray-500">
											{order.date || order.createdAt ?
												new Date(
													order.date || order.createdAt,
												).toLocaleDateString()
											:	"-"}
										</td>
									</motion.tr>
								);
							})}
						</tbody>
					</table>
				</div>

				{filteredOrders.length === 0 && (
					<div className="text-center py-20">
						<Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							No orders found
						</h3>
						<p className="text-gray-500">Try adjusting your search or filter</p>
					</div>
				)}
			</div>

			<p className="mt-4 text-sm text-gray-500">
				Showing {filteredOrders.length} of {orders.length} orders
			</p>
		</motion.div>
	);
};

export default OrderTable;
