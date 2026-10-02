import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
	ChevronLeft,
	ChevronRight,
	LayoutDashboard,
	Package,
	Users,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AdminSidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const location = useLocation();
	const { user } = useAuth();
	const shouldReduceMotion = useReducedMotion();
	const isSuperAdmin = user?.role === "superadmin";
	const navItems = [
		{ name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
		{ name: "Orders", path: "/admin/orders", icon: Package },
		...(isSuperAdmin ?
			[{ name: "Customers", path: "/admin/customers", icon: Users }]
		:	[]),
	];

	const isActive = (path) =>
		location.pathname === path ||
		(path === "/admin/dashboard" && location.pathname === "/admin");

	const renderLinks = (collapsed = false, onNavigate = () => {}) =>
		navItems.map(({ name, path, icon: Icon }) => (
			<Link
				key={path}
				to={path}
				onClick={onNavigate}
				aria-current={isActive(path) ? "page" : undefined}
				title={collapsed ? name : undefined}
				className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${
					isActive(path) ?
						"bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-200"
					:	"text-stone-600 hover:bg-stone-100 hover:text-stone-950"
				} ${collapsed ? "justify-center px-0" : ""}`}>
				<Icon
					className={`h-[18px] w-[18px] shrink-0 ${isActive(path) ? "text-amber-700" : "text-stone-400"}`}
				/>
				{!collapsed && <span>{name}</span>}
			</Link>
		));

	return (
		<>
			<motion.aside
				initial={false}
				animate={{ width: isCollapsed ? 76 : 232 }}
				transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
				className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-stone-200 bg-white lg:flex">
				<div
					className={`flex h-16 items-center border-b border-stone-100 ${isCollapsed ? "justify-center" : "gap-3 px-5"}`}>
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white">
						<span className="text-sm font-black">UB</span>
					</div>
					{!isCollapsed && (
						<div className="min-w-0">
							<p className="truncate text-sm font-extrabold text-stone-950">
								UB Restaurant
							</p>
							<p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
								Operations
							</p>
						</div>
					)}
				</div>
				<nav
					aria-label="Admin navigation"
					className={`flex-1 space-y-1 py-5 ${isCollapsed ? "px-3" : "px-4"}`}>
					<p
						className={`mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400 ${isCollapsed ? "sr-only" : "px-3"}`}>
						Workspace
					</p>
					{renderLinks(isCollapsed)}
				</nav>
				<button
					type="button"
					onClick={() => setIsCollapsed((collapsed) => !collapsed)}
					aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					className="mx-3 mb-4 flex h-10 items-center justify-center gap-2 rounded-lg text-xs font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-900">
					{isCollapsed ?
						<ChevronRight className="h-4 w-4" />
					:	<>
							<ChevronLeft className="h-4 w-4" />
							Collapse sidebar
						</>
					}
				</button>
			</motion.aside>

			<div className="lg:hidden">
				<button
					type="button"
					onClick={() => setIsMobileOpen(true)}
					aria-label="Open admin navigation"
					className="fixed left-4 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 shadow-sm lg:hidden">
					<LayoutDashboard className="h-5 w-5" />
				</button>
				<AnimatePresence>
					{isMobileOpen && (
						<motion.div
							initial={shouldReduceMotion ? false : { opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-[70] bg-stone-950/35"
							role="presentation"
							onClick={(event) => {
								if (event.target === event.currentTarget)
									setIsMobileOpen(false);
							}}>
							<motion.aside
								initial={shouldReduceMotion ? false : { x: -24 }}
								animate={{ x: 0 }}
								exit={{ x: -24 }}
								transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
								className="flex h-full w-[min(84vw,280px)] flex-col border-r border-stone-200 bg-white p-4 shadow-xl"
								aria-label="Admin navigation panel">
								<div className="flex h-12 items-center gap-3 border-b border-stone-100 pb-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-sm font-black text-white">
										UB
									</div>
									<div>
										<p className="text-sm font-extrabold text-stone-950">
											UB Restaurant
										</p>
										<p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
											Operations
										</p>
									</div>
								</div>
								<nav aria-label="Admin navigation" className="mt-5 space-y-1">
									{renderLinks(false, () => setIsMobileOpen(false))}
								</nav>
							</motion.aside>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
};

export default AdminSidebar;
