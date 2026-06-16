import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	Clock,
	CheckCircle2,
	ChefHat,
	TrendingUp,
	UserCheck,
	Package,
	Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../api";
import { formatCurrency } from "../components/utils";
import { useAuth } from "../contexts/AuthContext";

const AdminDashboard = () => {
	const { user } = useAuth();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("orders");
	const [updatingId, setUpdatingId] = useState(null);

	// Super Admin check flag
	const isSuperAdmin = user?.role === "superadmin";

	const fetchAllOrders = async () => {
		try {
			setLoading(true);
			// This calls your GET /api/orders route (backed by verifyJWT, isAdmin)
			const data = await api.getAllOrders();
			setOrders(data || []);
		} catch (error) {
			console.error("Dashboard data load error:", error);
			toast.error("Failed to load administration data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllOrders();
	}, []);

	const handleUpdateStatus = async (orderId, currentStatus) => {
		const statusMap = {
			pending: "preparing",
			preparing: "completed",
		};

		const nextStatus = statusMap[currentStatus];
		if (!nextStatus) return;

		try {
			setUpdatingId(orderId);
			// This calls your PATCH /api/orders/:id route
			await api.updateOrderStatus(orderId, { status: nextStatus });
			toast.success(`Order updated to ${nextStatus}!`);

			// Optimistic localized UI state refresh
			setOrders((prev) =>
				prev.map((order) =>
					order._id === orderId || order.id === orderId ?
						{ ...order, status: nextStatus }
					:	order,
				),
			);
		} catch (error) {
			console.error(error);
			toast.error("Failed to update status");
		} finally {
			setUpdatingId(null);
		}
	};

	// Derived operational summary cards calculations
	const metrics = {
		revenue: orders.reduce(
			(sum, o) => (o.status === "completed" ? sum + o.total : sum),
			0,
		),
		pending: orders.filter((o) => o.status === "pending").length,
		preparing: orders.filter((o) => o.status === "preparing").length,
		completed: orders.filter((o) => o.status === "completed").length,
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="w-10 h-10 animate-spin text-amber-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Dashboard Greetings Header */}
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 border-b pb-6">
					<div>
						<h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
							Management Portal
						</h1>
						<p className="text-gray-500 mt-1">
							Logged in as:{" "}
							<span className="font-semibold text-amber-700 capitalize">
								{user?.role}
							</span>{" "}
							({user?.fullName})
						</p>
					</div>

					{/* Navigation Tab Toggles */}
					<div className="flex gap-2 bg-gray-200 p-1.5 rounded-2xl w-fit">
						<button
							onClick={() => setActiveTab("orders")}
							className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "orders" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"}`}>
							Orders Tracker
						</button>
						{isSuperAdmin && (
							<button
								onClick={() => setActiveTab("superadmin")}
								className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "superadmin" ? "bg-amber-950 text-white shadow-sm" : "text-gray-600 hover:text-amber-950"}`}>
								<UserCheck className="w-4 h-4" />
								Super Admin Control
							</button>
						)}
					</div>
				</div>

				{activeTab === "orders" ?
					<>
						{/* Metrics Aggregation Row */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
							<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
								<div className="p-3 bg-green-50 text-green-600 rounded-2xl">
									<TrendingUp className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm text-gray-500 font-medium">
										Total Earnings
									</p>
									<p className="text-xl font-bold text-gray-900">
										{formatCurrency(metrics.revenue)}
									</p>
								</div>
							</div>
							<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
								<div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
									<Clock className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm text-gray-500 font-medium">
										Incoming Queue
									</p>
									<p className="text-xl font-bold text-gray-900">
										{metrics.pending} orders
									</p>
								</div>
							</div>
							<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
								<div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
									<ChefHat className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm text-gray-500 font-medium">
										In The Kitchen
									</p>
									<p className="text-xl font-bold text-gray-900">
										{metrics.preparing} meals
									</p>
								</div>
							</div>
							<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
								<div className="p-3 bg-gray-50 text-gray-600 rounded-2xl">
									<CheckCircle2 className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm text-gray-500 font-medium">Completed</p>
									<p className="text-xl font-bold text-gray-900">
										{metrics.completed} sets
									</p>
								</div>
							</div>
						</div>

						{/* Interactive Order Pipeline List */}
						<h2 className="text-xl font-bold text-gray-900 mb-6">
							Live Live Order Pipeline
						</h2>
						<div className="space-y-4 w-full">
							{orders.length === 0 ?
								<div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-500">
									No client orders registered in database.
								</div>
							:	orders.map((order, i) => (
									<motion.div
										key={order._id || order.id || i}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
										<div className="space-y-2 min-w-0 flex-1">
											<div className="flex flex-wrap items-center gap-3">
												<span className="font-bold text-sm bg-gray-100 px-3 py-1 rounded-xl text-gray-700 font-mono">
													#
													{String(order._id || order.id)
														.slice(-6)
														.toUpperCase()}
												</span>
												<span
													className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${
														order.status === "completed" ?
															"bg-green-100 text-green-700"
														: order.status === "preparing" ?
															"bg-amber-100 text-amber-700"
														:	"bg-blue-100 text-blue-700"
													}`}>
													{order.status}
												</span>
												<span className="text-sm font-medium text-amber-600">
													{formatCurrency(order.total)}
												</span>
											</div>

											<div className="text-sm text-gray-600 space-y-0.5">
												<p className="font-semibold text-gray-900">
													{order.customerName}
												</p>
												<p className="text-xs">
													{order.customerEmail} • {order.customerPhone}
												</p>
											</div>
										</div>

										{/* Dynamic Progress Action Button */}
										<div className="flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50 flex items-center justify-end">
											{order.status === "completed" ?
												<span className="text-sm font-semibold text-green-600 flex items-center gap-1.5 bg-green-50 px-4 py-2 rounded-xl">
													<CheckCircle2 className="w-4 h-4" /> Ready &
													Dispatched
												</span>
											:	<button
													disabled={updatingId === (order._id || order.id)}
													onClick={() =>
														handleUpdateStatus(
															order._id || order.id,
															order.status,
														)
													}
													className="px-5 py-3 rounded-xl text-sm font-medium bg-black text-white hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
													{updatingId === (order._id || order.id) ?
														<Loader2 className="w-4 h-4 animate-spin" />
													: order.status === "pending" ?
														<>Start Kitchen Preparation</>
													:	<>Mark Ready for PickUp</>}
												</button>
											}
										</div>
									</motion.div>
								))
							}
						</div>
					</>
				:	/* Super Admin View Context Placeholder */
					<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center py-20">
						<UserCheck className="w-14 h-14 mx-auto text-amber-700 mb-4" />
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Elevated Account Management Portal
						</h3>
						<p className="text-gray-500 max-w-md mx-auto text-sm mb-6">
							Authorized Super Admin access to change user privilege roles
							across the network.
						</p>
						{/* We'll link your user updating API table logic right here next */}
					</div>
				}
			</div>
		</div>
	);
};
