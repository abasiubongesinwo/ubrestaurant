import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Search, Users } from "lucide-react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import OrderTable from "../components/OrderTable";
import StatusBadge from "../components/StatusBadge";
import { useAdmin } from "../contexts/AdminContext";

const getCustomerOrders = (customer, orders) => {
	if (Array.isArray(customer?.orders) && customer.orders.length > 0) {
		return customer.orders;
	}

	return (orders || []).filter(
		(order) =>
			order.customerEmail?.toLowerCase() === customer.email?.toLowerCase(),
	);
};

const AdminCustomers = () => {
	const { customers, orders } = useAdmin();
	const [search, setSearch] = useState("");
	const [showCustomerOrders, setShowCustomerOrders] = useState(null);

	// Safely filter customers list down by search query matching names or emails
	const filteredCustomers = (customers || []).filter((customer) => {
		const name = customer.name?.toLowerCase() || "";
		const email = customer.email?.toLowerCase() || "";
		const query = search.toLowerCase();

		return name.includes(query) || email.includes(query);
	});

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-8">
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div>
					<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900 bg-clip-text text-transparent mb-3">
						Customers
					</h1>
					<p className="text-xl text-gray-600">
						Manage your customer database records and clear logs.
					</p>
				</div>
			</div>

			<div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
				{/* Search Bar Block */}
				<div className="flex items-center gap-4 mb-8">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Search customers by name or email..."
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all"
						/>
					</div>
				</div>

				{/* Grid Deck View Wrapper */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredCustomers.map((customer) => {
						// Gather individual customer profile datasets natively
						const customerOrders = getCustomerOrders(customer, orders);
						const totalOrders = customerOrders.length; // ✅ FIX: Defined totalOrders safely

						const latestOrder = [...customerOrders].sort(
							(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
						)[0];

						return (
							<motion.div
								// ✅ FIX: Fallbacks ensure unique list keys matching database records
								key={customer._id || customer.id || customer.email}
								whileHover={{ y: -4, scale: 1.02 }}
								className="group bg-gradient-to-b from-white to-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:border-amber-200 transition-all overflow-hidden flex flex-col justify-between h-full">
								<div>
									<div className="flex items-start justify-between mb-6">
										<div className="flex items-center gap-4">
											<div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
												<Users className="w-7 h-7 text-white" />
											</div>
											<div>
												<h3 className="font-bold text-xl text-gray-900 group-hover:text-amber-600 transition-colors">
													{customer.name}
												</h3>
												<p className="text-sm text-gray-500 truncate max-w-[180px]">
													{customer.email}
												</p>
											</div>
										</div>
									</div>

									<div className="space-y-4">
										<div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
											<span className="text-sm text-gray-600">
												Total Orders
											</span>
											<span className="text-2xl font-bold text-gray-900">
												{totalOrders}
											</span>
										</div>
										<div className="flex items-center p-4 bg-white/50 rounded-2xl">
											<StatusBadge
												status={latestOrder?.status || "No Orders"}
												className="mr-auto"
											/>
											<span className="text-sm text-gray-600 ml-2">
												Latest Status
											</span>
										</div>
									</div>
								</div>

								<Button
									size="sm"
									variant="outline"
									onClick={() =>
										setShowCustomerOrders({
											name: customer.name,
											email: customer.email,
											orders: customerOrders,
										})
									}
									className="w-full mt-6 group-hover:bg-amber-50 transition-all flex items-center justify-center gap-2">
									<Eye className="w-4 h-4" />
									View Orders
								</Button>
							</motion.div>
						);
					})}
				</div>

				{/* Blank State Fallback Layout */}
				{filteredCustomers.length === 0 && (
					<div className="text-center py-20">
						<Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
						<h3 className="text-2xl font-bold text-gray-900 mb-2">
							No customers found
						</h3>
						<p className="text-gray-600">
							Try adjusting your search query parameters
						</p>
					</div>
				)}
			</div>

			{/* Individual Order History Popout Modal Box */}
			{showCustomerOrders && (
				<Modal
					isOpen
					onClose={() => setShowCustomerOrders(null)}
					title={`${showCustomerOrders.name}'s Orders`}
					size="lg">
					<div className="max-h-[70vh] overflow-auto p-2">
						{showCustomerOrders.orders.length > 0 ?
							<OrderTable orders={showCustomerOrders.orders} />
						:	<p className="text-center text-gray-500 py-8">
								This customer hasn't placed any orders yet.
							</p>
						}
					</div>
				</Modal>
			)}
		</motion.div>
	);
};

export default AdminCustomers;
