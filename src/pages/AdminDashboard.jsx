import { useState } from "react";
import { motion } from "framer-motion";
import {
	AlertCircle,
	BarChart3,
	Clock,
	DollarSign,
	Package,
	Users,
} from "lucide-react";
import Button from "../components/Button";
import ChartModal from "../components/ChartModal";
import OrderTable from "../components/OrderTable";
import StatusBadge from "../components/StatusBadge";
import SummaryCard from "../components/SummaryCard";
import { formatCurrency } from "../components/utils";
import { useAdmin } from "../contexts/AdminContext";

const AdminDashboard = () => {
	const { orders, customers, isAdmin } = useAdmin();
	const [showAnalytics, setShowAnalytics] = useState(false);

	// const totalRevenue = orders.reduce(
	// 	(sum, order) => sum + (Number(order.total) || 0),
	// 	0,
	// );
	// const totalOrders = orders.length;
	// const totalCustomers = customers.length;
	// const pendingOrders = orders.filter(
	// 	(order) => order.status === "pending",
	// ).length;
	// const completedOrders = orders.filter(
	// 	(order) => order.status === "completed",
	// ).length;
	// const completionRate =
	// 	totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
	// const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

	const totalRevenue = (orders || []).reduce(
		(sum, order) => sum + (Number(order.total) || 0),
		0,
	);

	const totalOrders = (orders || []).length;
	const totalCustomers = (customers || []).length;

	const pendingOrders = (orders || []).filter(
		(o) => o.status === "pending",
	).length;

	const completedOrders = (orders || []).filter(
		(o) => o.status === "completed",
	).length;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-8">
			<div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
				<div>
					<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900 bg-clip-text text-transparent mb-3">
						Dashboard
					</h1>
					<p className="text-xl text-gray-600">
						Welcome back! Here&apos;s what&apos;s happening with your
						restaurant.
					</p>
				</div>
				<Button
					size="lg"
					onClick={() => setShowAnalytics(true)}
					className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
					<BarChart3 className="w-5 h-5" />
					View Analytics
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
				<SummaryCard
					title="Total Orders"
					value={totalOrders.toLocaleString()}
					change={12}
					icon={Package}
					trend="up"
				/>
				<SummaryCard
					title="Revenue"
					value={formatCurrency(totalRevenue)}
					change={18}
					icon={DollarSign}
					trend="up"
				/>
				<SummaryCard
					title="Customers"
					value={totalCustomers}
					change={8}
					icon={Users}
				/>
				<SummaryCard
					title="Pending Orders"
					value={pendingOrders}
					change={5}
					icon={Clock}
					trend="up"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
							Recent Orders
							<StatusBadge
								status={pendingOrders > 0 ? "pending" : "completed"}
							/>
						</h2>
						<OrderTable orders={orders.slice(0, 5)} />
					</div>
				</div>
				<div className="space-y-6">
					<div className="bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-emerald-200/50 rounded-3xl p-8">
						<h3 className="text-xl font-bold text-gray-900 mb-4">
							Quick Stats
						</h3>
						<div className="space-y-4">
							<div className="flex justify-between items-center p-4 bg-white rounded-2xl">
								<span className="font-semibold text-gray-900">
									Completion Rate
								</span>
								<div className="text-2xl font-bold text-emerald-600">
									{completionRate}%
								</div>
							</div>
							<div className="flex justify-between items-center p-4 bg-white rounded-2xl">
								<span className="font-semibold text-gray-900">
									Avg Order Value
								</span>
								<div className="text-2xl font-bold text-amber-600">
									{formatCurrency(averageOrderValue)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ChartModal
				isOpen={showAnalytics}
				onClose={() => setShowAnalytics(false)}
			/>
		</motion.div>
	);
};

export default AdminDashboard;
