import { useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { api } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import MetricsRow from "../components/MetricsRow";
import OrderPipeline from "../components/OrderPipeline";
import UserManagementTab from "../components/UserManagementTab";

const AdminDashboard = () => {
	const { user } = useAuth();

	const [orders, setOrders] = useState([]);
	const [customers, setCustomers] = useState([]);

	const [loading, setLoading] = useState(true);
	const [customersLoading, setCustomersLoading] = useState(false);

	const [activeTab, setActiveTab] = useState("orders");

	const [updatingId, setUpdatingId] = useState(null);
	const [roleUpdatingId, setRoleUpdatingId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);

	const isAdmin = user?.role === "admin" || user?.role === "superadmin";

	const isSuperAdmin = user?.role === "superadmin";

	/*
	|--------------------------------------------------------------------------
	| Load Orders
	|--------------------------------------------------------------------------
	*/

	useEffect(() => {
		let isActive = true;

		const loadOrders = async () => {
			try {
				setLoading(true);

				const data = await api.getOrders();

				if (isActive) {
					setOrders(data || []);
				}
			} catch (error) {
				console.error("Failed to load orders:", error);

				if (isActive) {
					toast.error("Failed to load administration data");
				}
			} finally {
				if (isActive) {
					setLoading(false);
				}
			}
		};

		void loadOrders();

		return () => {
			isActive = false;
		};
	}, []);

	/*
	|--------------------------------------------------------------------------
	| Load Customers
	| ONLY SUPER ADMIN
	|--------------------------------------------------------------------------
	*/

	useEffect(() => {
		if (!isSuperAdmin && activeTab === "superadmin") {
			setActiveTab("orders");
		}
	}, [activeTab, isSuperAdmin]);

	useEffect(() => {
		if (!isSuperAdmin || activeTab !== "superadmin") {
			return;
		}

		let isActive = true;

		const loadCustomers = async () => {
			try {
				setCustomersLoading(true);

				const data = await api.getCustomers();

				if (isActive) {
					setCustomers(data || []);
				}
			} catch (error) {
				console.error("Failed to load customers:", error);

				if (isActive) {
					toast.error("Could not load user accounts directory");
				}
			} finally {
				if (isActive) {
					setCustomersLoading(false);
				}
			}
		};

		void loadCustomers();

		return () => {
			isActive = false;
		};
	}, [activeTab, isSuperAdmin]);

	/*
	|--------------------------------------------------------------------------
	| Update Order Status
	|--------------------------------------------------------------------------
	*/

	const handleUpdateStatus = async (orderId, currentStatus) => {
		const statusMap = {
			pending: "preparing",
			preparing: "completed",
		};

		const nextStatus = statusMap[currentStatus];

		if (!nextStatus) {
			return;
		}

		try {
			setUpdatingId(orderId);

			await api.updateOrderStatus(orderId, nextStatus);

			toast.success(`Order updated to ${nextStatus}!`);

			setOrders((prev) =>
				prev.map((order) =>
					order._id === orderId || order.id === orderId ?
						{
							...order,
							status: nextStatus,
						}
					:	order,
				),
			);
		} catch (error) {
			console.error("Failed to update order:", error);

			toast.error("Failed to update status");
		} finally {
			setUpdatingId(null);
		}
	};

	/*
	|--------------------------------------------------------------------------
	| Toggle User Role
	| SUPER ADMIN ONLY
	|--------------------------------------------------------------------------
	*/

	const handleToggleRole = async (userId, currentRole) => {
		if (!isSuperAdmin) {
			toast.error("Access Denied: Super Admin role required.");
			return;
		}

		/*
		 * Prevent changing a superadmin account from this simple toggle.
		 */
		if (currentRole === "superadmin") {
			toast.error("Super Admin accounts cannot be modified here.");
			return;
		}

		const newRole = currentRole === "admin" ? "user" : "admin";

		try {
			setRoleUpdatingId(userId);

			if (!api.updateUserRole) {
				throw new Error("User role API is unavailable");
			}

			await api.updateUserRole(userId, newRole);

			toast.success(`User role changed to ${newRole}`);

			setCustomers((prev) =>
				prev.map((customer) =>
					customer._id === userId ?
						{
							...customer,
							role: newRole,
						}
					:	customer,
				),
			);
		} catch (error) {
			console.error("Failed to update user role:", error);

			toast.error("Failed to update user role");
		} finally {
			setRoleUpdatingId(null);
		}
	};

	/*
	|--------------------------------------------------------------------------
	| Delete User
	| SUPER ADMIN ONLY
	|--------------------------------------------------------------------------
	*/

	const handleDeleteUser = async (userId) => {
		if (!isSuperAdmin) {
			toast.error("Access Denied: Super Admin role required.");
			return;
		}

		const customer = customers.find((item) => item._id === userId);

		if (customer?.role === "superadmin") {
			toast.error("Super Admin accounts cannot be deleted.");
			return;
		}

		const confirmed = window.confirm(
			"Are you sure you want to permanently delete this user?",
		);

		if (!confirmed) {
			return;
		}

		try {
			setDeletingId(userId);

			if (!api.deleteUser) {
				throw new Error("Delete user API is unavailable");
			}

			await api.deleteUser(userId);

			toast.success("User account successfully removed");

			setCustomers((prev) =>
				prev.filter((customer) => customer._id !== userId),
			);
		} catch (error) {
			console.error("Failed to delete user:", error);

			toast.error("Failed to delete user account");
		} finally {
			setDeletingId(null);
		}
	};

	/*
	|--------------------------------------------------------------------------
	| Access Protection
	|--------------------------------------------------------------------------
	*/

	if (!isAdmin) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-gray-100">
					<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
						<Shield className="h-8 w-8 text-red-500" />
					</div>

					<h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>

					<p className="mt-3 text-gray-500">
						You do not have permission to access the administration portal.
					</p>
				</div>
			</div>
		);
	}

	/*
	|--------------------------------------------------------------------------
	| Loading
	|--------------------------------------------------------------------------
	*/

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="w-10 h-10 animate-spin text-amber-600" />
			</div>
		);
	}

	/*
	|--------------------------------------------------------------------------
	| Dashboard
	|--------------------------------------------------------------------------
	*/

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
			<div className="mx-auto max-w-7xl">
				{/* Header */}

				<div className="mb-8 border-b border-gray-200 pb-6">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
								Management Portal
							</h1>

							<p className="mt-1 text-sm text-gray-500 sm:text-base">
								Logged in as{" "}
								<span className="font-semibold capitalize text-amber-700">
									{user?.role}
								</span>
								{user?.fullName && <> ({user.fullName})</>}
							</p>
						</div>

						{/* Tabs */}

						<div className="flex w-full overflow-x-auto rounded-2xl bg-gray-200 p-1 sm:w-fit">
							{/* Orders - Everyone */}

							<button
								type="button"
								onClick={() => setActiveTab("orders")}
								className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:px-5 ${
									activeTab === "orders" ?
										"bg-white text-gray-900 shadow-sm"
									:	"text-gray-600 hover:text-gray-900"
								}`}>
								Orders Tracker
							</button>

							{/* Accounts - SUPER ADMIN ONLY */}

							{isSuperAdmin && (
								<button
									type="button"
									onClick={() => setActiveTab("superadmin")}
									className={`flex whitespace-nowrap items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:px-5 ${
										activeTab === "superadmin" ?
											"bg-amber-950 text-white shadow-sm"
										:	"text-gray-600 hover:text-amber-950"
									}`}>
									<Shield className="h-4 w-4" />
									Accounts Directory
								</button>
							)}
						</div>
					</div>
				</div>

				{/* ============================= */}
				{/* ORDERS TAB */}
				{/* ============================= */}

				{activeTab === "orders" && (
					<>
						<MetricsRow orders={orders} />

						<div className="mt-8">
							<h2 className="mb-5 text-xl font-bold text-gray-900">
								Live Order Pipeline
							</h2>

							<OrderPipeline
								orders={orders}
								updatingId={updatingId}
								onUpdateStatus={handleUpdateStatus}
							/>
						</div>
					</>
				)}

				{/* ============================= */}
				{/* SUPER ADMIN TAB */}
				{/* ============================= */}

				{activeTab === "superadmin" && isSuperAdmin && (
					<UserManagementTab
						customers={customers}
						customersLoading={customersLoading}
						isSuperAdmin={true}
						roleUpdatingId={roleUpdatingId}
						deletingId={deletingId}
						onToggleRole={handleToggleRole}
						onDeleteUser={handleDeleteUser}
					/>
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
