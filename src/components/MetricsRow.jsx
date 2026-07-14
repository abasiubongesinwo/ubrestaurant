import { TrendingUp, Clock, ChefHat, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../components/utils";

const MetricsRow = ({ orders = [] }) => {
	const metrics = {
		revenue: orders.reduce((sum, o) => {
			// Paystack or system flags confirming payment has been received
			const isPaid =
				o.status === "completed" ||
				o.paymentStatus === "paid" ||
				o.paymentStatus === "success" ||
				o.isPaid === true;

			return isPaid ? sum + (o.totalAmount || o.total || o.amount || 0) : sum;
		}, 0),
		pending: orders.filter((o) => o.status === "pending").length,
		preparing: orders.filter(
			(o) => o.status === "preparing" || o.status === "preparing",
		).length,
		completed: orders.filter((o) => o.status === "completed").length,
	};

	const cardConfigs = [
		{
			label: "Total Earnings",
			val: formatCurrency(metrics.revenue),
			bg: "bg-green-50 text-green-600",
			icon: TrendingUp,
		},
		{
			label: "Incoming Queue",
			val: `${metrics.pending} orders`,
			bg: "bg-blue-50 text-blue-600",
			icon: Clock,
		},
		{
			label: "In The Kitchen",
			val: `${metrics.preparing} meals`,
			bg: "bg-amber-50 text-amber-600",
			icon: ChefHat,
		},
		{
			label: "Completed",
			val: `${metrics.completed} sets`,
			bg: "bg-gray-50 text-gray-600",
			icon: CheckCircle2,
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
			{cardConfigs.map((card, idx) => {
				const Icon = card.icon;
				return (
					<div
						key={idx}
						className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
						<div className={`p-3 rounded-2xl ${card.bg}`}>
							<Icon className="w-6 h-6" />
						</div>
						<div>
							<p className="text-sm text-gray-500 font-medium">{card.label}</p>
							<p className="text-xl font-bold text-gray-900">{card.val}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default MetricsRow;
