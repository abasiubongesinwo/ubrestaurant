import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	Package,
	Users,
	Settings,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Dynamic role tracking helper

const AdminSidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const location = useLocation();
	const { user } = useAuth(); // Grab the logged-in user's data

	const isSuperAdmin = user?.role === "superadmin";

	// Base navigation menu items available to everyone with access
	const navItems = [
		{ name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
		{ name: "Orders", path: "/admin/orders", icon: Package },

		// 🔒 Conditional Item: Only inject the Customer Directory if they are Super Admin
		...(isSuperAdmin ?
			[{ name: "Customers", path: "/admin/customers", icon: Users }]
		:	[]),

		{ name: "Settings", path: "/admin/settings", icon: Settings },
	];

	return (
		<motion.aside
			initial={false}
			animate={{ width: isCollapsed ? 80 : 280 }}
			className="bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 shadow-lg h-screen sticky top-0 z-40">
			{/* Sidebar Top Header Branding */}
			<div className="p-6 border-b border-gray-100 flex items-center justify-between">
				{!isCollapsed ?
					<div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
							UB Admin
						</h1>
						<p className="text-xs text-gray-400 capitalize font-medium tracking-wide">
							{user?.role || "Management"} View
						</p>
					</div>
				:	<button
						onClick={() => setIsCollapsed(false)}
						className="p-2 mx-auto rounded-xl hover:bg-gray-100 transition-colors">
						<ChevronRight className="w-5 h-5 text-gray-700" />
					</button>
				}
			</div>

			{/* Nav links rendering loop */}
			<nav className="p-4 space-y-2">
				{navItems.map((item) => {
					const Icon = item.icon;
					// Matches active state even if on the index root fallback path
					const active =
						location.pathname === item.path ||
						(item.path === "/admin/dashboard" &&
							location.pathname === "/admin");

					return (
						<Link
							key={item.path}
							to={item.path}
							className={`flex items-center space-x-3 p-4 rounded-2xl transition-all group ${
								active ?
									"bg-amber-50 border border-amber-200 text-amber-800 shadow-xs"
								:	"text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
							} ${isCollapsed ? "justify-center space-x-0" : ""}`}
							title={isCollapsed ? item.name : ""}>
							<Icon
								className={`w-6 h-6 flex-shrink-0 ${active ? "text-amber-600" : "text-gray-500 group-hover:text-amber-600 transition-colors"}`}
							/>
							{!isCollapsed && (
								<span className="font-medium truncate">{item.name}</span>
							)}
						</Link>
					);
				})}
			</nav>

			{/* Collapse Toggle Footer Action Toggle Panel */}
			<div className="absolute bottom-6 left-4 right-4">
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-100 hover:bg-gray-200/80 rounded-2xl transition-all group">
					{isCollapsed ?
						<ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
					:	<>
							<ChevronLeft className="w-5 h-5 text-gray-600" />
							<span className="font-medium text-sm text-gray-800">
								Collapse Panel
							</span>
						</>
					}
				</button>
			</div>
		</motion.aside>
	);
};

export default AdminSidebar;
