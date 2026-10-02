import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	LogOut,
	Package,
	ShoppingCart,
	UserRound,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const accountLinks = [
	{ label: "Overview", to: "/account", end: true, icon: LayoutDashboard },
	{ label: "My Orders", to: "/account/orders", icon: Package },
	{ label: "Profile", to: "/account/profile", icon: UserRound },
	{ label: "Cart", to: "/cart", icon: ShoppingCart },
];

const AccountLayout = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const shouldReduceMotion = useReducedMotion();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<main className="min-h-[calc(100vh-4rem)] bg-stone-50 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
						UB Restaurant
					</p>
					<h1 className="mt-1 text-2xl font-extrabold text-gray-950 sm:text-3xl">
						Your account
					</h1>
					<p className="mt-1 text-sm text-gray-600">
						Welcome back, {user?.fullName || "there"}.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-8">
					<aside className="self-start rounded-2xl border border-stone-200 bg-white p-2 shadow-sm lg:sticky lg:top-24">
						<nav
							aria-label="Customer account navigation"
							className="flex gap-1 overflow-x-auto lg:flex-col">
							{accountLinks.map(({ label, to, end, icon: Icon }) => (
								<NavLink
									key={to}
									to={to}
									end={end}
									className={({ isActive }) =>
										`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-amber-50 text-amber-800" : "text-gray-600 hover:bg-stone-50 hover:text-gray-950"}`
									}>
									<Icon className="h-4 w-4" />
									{label}
								</NavLink>
							))}
							<button
								type="button"
								onClick={handleLogout}
								className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700 lg:w-full">
								<LogOut className="h-4 w-4" />
								Logout
							</button>
						</nav>
					</aside>

					<div className="min-w-0">
						<motion.div
							key={location.pathname}
							initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}>
							<Outlet />
						</motion.div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default AccountLayout;
