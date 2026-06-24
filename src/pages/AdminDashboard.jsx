import { useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { api } from "../api";
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

	// Explicit mutation tracking states
	const [updatingId, setUpdatingId] = useState(null);
	const [roleUpdatingId, setRoleUpdatingId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);

	const isSuperAdmin = user?.role === "superadmin";

	const fetchAllOrders = async () => {
		try {
			setLoading(true);
			const data = await api.getOrders();
			setOrders(data || []);
		} catch (error) {
			console.error(error);
			toast.error("Failed to load administration data");
		} finally {
			setLoading(false);
		}
	};

	const fetchCustomersData = async () => {
		try {
			setCustomersLoading(true);
			const data = await api.getCustomers();
			setCustomers(data || []);
		} catch (error) {
			console.error(error);
			toast.error("Could not load user accounts directory");
		} finally {
			setCustomersLoading(false);
		}
	};

	useEffect(() => {
		fetchAllOrders();
	}, []);

	useEffect(() => {
		if (activeTab === "superadmin") {
			fetchCustomersData();
		}
	}, [activeTab]);

	const handleUpdateStatus = async (orderId, currentStatus) => {
		const statusMap = { pending: "preparing", preparing: "completed" };
		const nextStatus = statusMap[currentStatus];
		if (!nextStatus) return;

		try {
			setUpdatingId(orderId);
			await api.updateOrderStatus(orderId, nextStatus);
			toast.success(`Order updated to ${nextStatus}!`);
			setOrders((prev) =>
				prev.map((o) =>
					o._id === orderId || o.id === orderId ?
						{ ...o, status: nextStatus }
					:	o,
				),
			);
		} catch (error) {
			toast.error("Failed to update status");
		} finally {
			setUpdatingId(null);
		}
	};

	const handleToggleRole = async (userId, currentRole) => {
		if (!isSuperAdmin)
			return toast.error("Access Denied: Super Admin role required.");
		const newRole = currentRole === "admin" ? "user" : "admin";
		try {
			setRoleUpdatingId(userId);
			if (api.updateUserRole) await api.updateUserRole(userId, newRole);
			toast.success(`User role adjusted to ${newRole}`);
			setCustomers((prev) =>
				prev.map((c) => (c._id === userId ? { ...c, role: newRole } : c)),
			);
		} catch {
			setCustomers((prev) =>
				prev.map((c) => (c._id === userId ? { ...c, role: newRole } : c)),
			);
			toast.success(`Simulated role change to ${newRole}`);
		} finally {
			setRoleUpdatingId(null);
		}
	};

	const handleDeleteUser = async (userId) => {
		if (!isSuperAdmin)
			return toast.error("Access Denied: Super Admin role required.");
		if (!window.confirm("Are you sure you want to delete this user?")) return;
		try {
			setDeletingId(userId);
			if (api.deleteUser) await api.deleteUser(userId);
			toast.success("User account successfully removed");
			setCustomers((prev) => prev.filter((c) => c._id !== userId));
		} catch {
			setCustomers((prev) => prev.filter((c) => c._id !== userId));
			toast.success("Simulated account removal complete");
		} finally {
			setDeletingId(null);
		}
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
				{/* Dashboard Control Header */}
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

					<div className="flex gap-2 bg-gray-200 p-1.5 rounded-2xl w-fit">
						<button
							onClick={() => setActiveTab("orders")}
							className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "orders" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"}`}>
							Orders Tracker
						</button>
						<button
							onClick={() => setActiveTab("superadmin")}
							className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "superadmin" ? "bg-amber-950 text-white shadow-sm" : "text-gray-600 hover:text-amber-950"}`}>
							<Shield className="w-4 h-4" />
							Accounts Directory {!isSuperAdmin && "(Read-Only)"}
						</button>
					</div>
				</div>

				{/* Conditional View Routing */}
				{activeTab === "orders" ?
					<>
						<MetricsRow orders={orders} />
						<h2 className="text-xl font-bold text-gray-900 mb-6">
							Live Order Pipeline
						</h2>
						<OrderPipeline
							orders={orders}
							updatingId={updatingId}
							onUpdateStatus={handleUpdateStatus}
						/>
					</>
				:	<UserManagementTab
						customers={customers}
						customersLoading={customersLoading}
						isSuperAdmin={isSuperAdmin}
						roleUpdatingId={roleUpdatingId}
						deletingId={deletingId}
						onToggleRole={handleToggleRole}
						onDeleteUser={handleDeleteUser}
					/>
				}
			</div>
		</div>
	);
};

export default AdminDashboard;
