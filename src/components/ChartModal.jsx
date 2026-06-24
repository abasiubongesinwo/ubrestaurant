import { useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";
import { useAdmin } from "../contexts/AdminContext";
import Button from "./Button";
import Modal from "./Modal";
import { formatCurrency } from "./utils";

const ChartModal = ({ isOpen, onClose }) => {
	const { orders } = useAdmin();
	const [activeChart, setActiveChart] = useState("orders");

	const chartData = useMemo(() => {
		const monthlyMap = new Map();

		orders.forEach((order) => {
			if (!order.date) {
				return;
			}

			const date = new Date(order.date);
			const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
			const monthLabel = date.toLocaleDateString("en-US", { month: "short" });
			const currentMonth = monthlyMap.get(monthKey) ?? {
				month: monthLabel,
				orders: 0,
				revenue: 0,
				averageOrderValue: 0,
			};

			currentMonth.orders += 1;
			currentMonth.revenue += Number(order.total) || 0;
			currentMonth.averageOrderValue =
				currentMonth.orders > 0 ?
					currentMonth.revenue / currentMonth.orders
				:	0;

			monthlyMap.set(monthKey, currentMonth);
		});

		return Array.from(monthlyMap.entries()).map(([, value]) => value);
	}, [orders]);

	const latestMonth = chartData.at(-1);
	const previousMonth = chartData.at(-2);
	const totalOrdersThisMonth = latestMonth?.orders ?? 0;
	const monthlyRevenue = latestMonth?.revenue ?? 0;
	const growthVsLastMonth =
		previousMonth?.orders ?
			Math.round(
				((totalOrdersThisMonth - previousMonth.orders) / previousMonth.orders) *
					100,
			)
		:	0;

	const renderChart = () => {
		if (activeChart === "orders") {
			return (
				<LineChart
					data={chartData}
					margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
					<CartesianGrid
						vertical={false}
						strokeDasharray="3 3"
						stroke="#f3f4f6"
					/>
					<XAxis
						dataKey="month"
						axisLine={false}
						tickLine={false}
						tickMargin={20}
						tick={{ fontSize: 14, fill: "#6b7280" }}
					/>
					<YAxis
						axisLine={false}
						tickLine={false}
						tickMargin={20}
						tick={{ fontSize: 14, fill: "#6b7280" }}
					/>
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="orders"
						stroke="#f59e0b"
						strokeWidth={4}
						dot={{ fill: "#f59e0b", strokeWidth: 2 }}
					/>
				</LineChart>
			);
		}

		if (activeChart === "revenue") {
			return (
				<BarChart
					data={chartData}
					margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
					<CartesianGrid
						vertical={false}
						strokeDasharray="3 3"
						stroke="#f3f4f6"
					/>
					<XAxis
						dataKey="month"
						axisLine={false}
						tickLine={false}
						tickMargin={20}
						tick={{ fontSize: 14, fill: "#6b7280" }}
					/>
					<YAxis
						axisLine={false}
						tickLine={false}
						tickMargin={20}
						tick={{ fontSize: 14, fill: "#6b7280" }}
					/>
					<Tooltip formatter={(value) => formatCurrency(value)} />
					<Legend />
					<Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
				</BarChart>
			);
		}

		return (
			<LineChart
				data={chartData}
				margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
				<CartesianGrid
					vertical={false}
					strokeDasharray="3 3"
					stroke="#f3f4f6"
				/>
				<XAxis
					dataKey="month"
					axisLine={false}
					tickLine={false}
					tickMargin={20}
					tick={{ fontSize: 14, fill: "#6b7280" }}
				/>
				<YAxis
					axisLine={false}
					tickLine={false}
					tickMargin={20}
					tick={{ fontSize: 14, fill: "#6b7280" }}
				/>
				<Tooltip formatter={(value) => formatCurrency(value)} />
				<Legend />
				<Line
					type="monotone"
					dataKey="averageOrderValue"
					stroke="#2563eb"
					strokeWidth={4}
					dot={{ fill: "#2563eb", strokeWidth: 2 }}
				/>
			</LineChart>
		);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Sales Analytics" size="xl">
			<div className="space-y-8">
				<div className="flex flex-wrap gap-3 mb-8">
					<Button
						variant={activeChart === "orders" ? "primary" : "outline"}
						onClick={() => setActiveChart("orders")}
						className="flex items-center gap-2">
						<Calendar className="w-4 h-4" />
						Orders Over Time
					</Button>
					<Button
						variant={activeChart === "revenue" ? "primary" : "outline"}
						onClick={() => setActiveChart("revenue")}
						className="flex items-center gap-2">
						<DollarSign className="w-4 h-4" />
						Revenue
					</Button>
					<Button
						variant={activeChart === "trending" ? "primary" : "outline"}
						onClick={() => setActiveChart("trending")}
						className="flex items-center gap-2">
						<TrendingUp className="w-4 h-4" />
						Trends
					</Button>
				</div>

				<div className="h-96 bg-gray-50/50 rounded-2xl p-6">
					{chartData.length > 0 ?
						<ResponsiveContainer width="100%" height="100%">
							{renderChart()}
						</ResponsiveContainer>
					:	<div className="h-full flex items-center justify-center text-gray-500">
							No analytics data available yet.
						</div>
					}
				</div>

				<div className="grid md:grid-cols-3 gap-6 pt-4">
					<div className="text-center p-6 bg-white rounded-2xl shadow-sm">
						<div className="text-3xl font-bold text-emerald-600 mb-1">
							{totalOrdersThisMonth}
						</div>
						<div className="text-sm text-gray-600">Total Orders This Month</div>
					</div>
					<div className="text-center p-6 bg-white rounded-2xl shadow-sm">
						<div className="text-3xl font-bold text-amber-600 mb-1">
							{formatCurrency(monthlyRevenue)}
						</div>
						<div className="text-sm text-gray-600">Monthly Revenue</div>
					</div>
					<div className="text-center p-6 bg-white rounded-2xl shadow-sm">
						<div className="text-3xl font-bold text-blue-600 mb-1">
							{growthVsLastMonth}%
						</div>
						<div className="text-sm text-gray-600">Growth vs Last Month</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ChartModal;
