import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Utensils } from "lucide-react";
import { formatCurrency } from "../components/utils";

const OrderPipeline = ({ orders, updatingId, onUpdateStatus }) => {
	if (orders.length === 0) {
		return (
			<div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-500">
				No client orders registered in database.
			</div>
		);
	}

	return (
		<div className="space-y-4 w-full">
			{orders.map((order, i) => {
				const id = order._id || order.id;
				return (
					<motion.div
						key={id || i}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
						<div className="space-y-3 min-w-0 flex-1">
							<div className="flex flex-wrap items-center gap-3">
								<span className="font-bold text-sm bg-gray-100 px-3 py-1 rounded-xl text-gray-700 font-mono">
									#{String(id).slice(-6).toUpperCase()}
								</span>
								<span
									className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${
										(
											order.status === "completed" ||
											order.status === "delivered"
										) ?
											"bg-green-100 text-green-700"
										: (
											order.status === "preparing" ||
											order.status === "processing"
										) ?
											"bg-amber-100 text-amber-700"
										:	"bg-blue-100 text-blue-700"
									}`}>
									{order.status}
								</span>
								<span className="text-sm font-medium text-amber-600">
									{formatCurrency(order.totalAmount || order.total || 0)}
								</span>
							</div>

							<div className="text-sm text-gray-600 space-y-1">
								<p className="font-semibold text-gray-900">
									{order.customerName ||
										order.user?.fullName ||
										order.user?.fullname ||
										"Guest Customer"}
								</p>
								<p className="text-xs">
									{order.customerEmail || order.user?.email} •{" "}
									{order.deliveryAddress || "Dine-In / Takeout"}
								</p>
							</div>

							{/* Order Items List Layout */}
							<div className="pt-2 border-t border-gray-50 flex flex-wrap gap-3">
								{(order.items || []).map((item, itemIndex) => (
									<div
										key={itemIndex}
										className="flex items-center gap-2 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100/50 text-xs text-gray-700">
										{item.productId?.image ?
											<img
												src={item.productId.image}
												alt="Product"
												className="w-5 h-5 object-cover rounded-md"
											/>
										:	<Utensils className="w-3.5 h-3.5 text-gray-400" />}
										<span className="font-bold text-gray-900">
											{item.quantity || item.qty || 1}x
										</span>
										<span className="font-medium">
											{item.productId?.name ||
												item.productId?.title ||
												item.name ||
												"Menu Item"}
										</span>
									</div>
								))}
							</div>
						</div>

						<div className="flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50 flex items-center justify-end">
							{order.status === "completed" || order.status === "delivered" ?
								<span className="text-sm font-semibold text-green-600 flex items-center gap-1.5 bg-green-50 px-4 py-2 rounded-xl">
									<CheckCircle2 className="w-4 h-4" /> Ready & Dispatched
								</span>
							:	<button
									disabled={updatingId === id}
									onClick={() => onUpdateStatus(id, order.status)}
									className="px-5 py-3 rounded-xl text-sm font-medium bg-black text-white hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm w-full lg:w-auto justify-center">
									{updatingId === id ?
										<Loader2 className="w-4 h-4 animate-spin" />
									: order.status === "pending" ?
										<>Start Kitchen Preparation</>
									:	<>Mark Ready for PickUp</>}
								</button>
							}
						</div>
					</motion.div>
				);
			})}
		</div>
	);
};

export default OrderPipeline;
