import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import UbLogo from "/ubrestaurantlogo.png";

const Navbar = ({ siteSettings = null }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const profileMenuRef = useRef(null);
	const location = useLocation();
	const navigate = useNavigate();
	const { items } = useCart();
	const { user, logout, isAuthenticated } = useAuth();

	const isManagement = user?.role === "admin" || user?.role === "superadmin";
	const brandName = siteSettings?.restaurantName || "UB Restaurant";

	const displayName =
		isManagement ? `${user?.fullName} (${user?.role})` : user?.fullName;

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				profileMenuRef.current &&
				!profileMenuRef.current.contains(event.target)
			) {
				setShowProfileMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Menu", path: "/services" },
		{ name: "About", path: "/about" },
		{ name: "Contact", path: "/contact" },
		{ name: "Gallery", path: "/gallery" },
		...(isManagement ? [{ name: "Dashboard", path: "/admin/dashboard" }] : []),
	];

	const authLinks = [
		{ name: "Login", path: "/login" },
		{ name: "Sign Up", path: "/signup" },
	];

	const handleLogout = () => {
		logout();
		setShowProfileMenu(false);
		navigate("/");
	};

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-3">
					<div className="flex items-center">
						<Link
							to="/"
							className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
							<img
								src={UbLogo}
								alt={`${brandName} Logo`}
								loading="eager"
								decoding="async"
								fetchPriority="high"
								className="h-10 w-auto"
							/>
						</Link>
					</div>

					<div className="hidden md:flex items-center gap-2 lg:gap-4">
						{navLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={`rounded-full px-3 py-2 text-sm font-medium transition-colors lg:text-base ${
									location.pathname === link.path ?
										"text-amber-600 font-semibold"
									:	"text-gray-700 hover:text-amber-600 hover:bg-amber-50"
								}`}>
								{link.name}
							</Link>
						))}
					</div>

					<div className="flex items-center gap-2 md:gap-3">
						<Link
							to="/cart"
							className="relative rounded-full p-2 transition-all hover:bg-amber-50">
							<ShoppingCart className="w-6 h-6 text-gray-700" />
							{items.length > 0 && (
								<span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
									{items.length > 99 ? "99+" : items.length}
								</span>
							)}
						</Link>

						{isAuthenticated ?
							<div className="relative" ref={profileMenuRef}>
								<button
									onClick={() => setShowProfileMenu(!showProfileMenu)}
									className="flex items-center gap-2 rounded-full p-2 transition-all hover:bg-amber-50">
									<User className="w-6 h-6 text-gray-700" />
									<span className="hidden md:block text-sm font-medium text-gray-700 capitalize">
										{displayName || "Profile"}
									</span>
								</button>

								{showProfileMenu && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
										{/* User Metadata Header */}
										<div className="px-4 py-3 border-b border-gray-100">
											<p className="text-sm font-semibold text-gray-900">
												{user?.fullName}
											</p>

											{isManagement && (
												<p className="text-xs font-semibold uppercase text-amber-600">
													{user?.role}
												</p>
											)}

											<p className="text-sm text-gray-500 truncate">
												{user?.email}
											</p>
										</div>
										{/* Dynamic UI Content based on Role Clearance */}
										{isManagement ?
											<div className="p-1 border-b border-gray-100 bg-amber-50/50">
												<Link
													to="/admin/dashboard"
													onClick={() => setShowProfileMenu(false)}
													className="flex items-center gap-2 px-3 py-2 text-sm text-amber-900 font-semibold hover:bg-amber-100/70 rounded-lg transition-colors">
													<ShieldCheck className="w-4 h-4 text-amber-600" />
													<span>
														{user?.role === "superadmin" ?
															"Superadmin Portal"
														:	"Admin Dashboard"}
													</span>
												</Link>
											</div>
										:	null}

										{/* Universal Logout Trigger button */}
										<div className="p-1">
											<button
												onClick={handleLogout}
												className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg transition-colors font-medium">
												<LogOut className="w-4 h-4" />
												<span>Logout</span>
											</button>
										</div>
									</motion.div>
								)}
							</div>
						:	<div className="hidden md:flex items-center gap-2">
								{authLinks.map((link) => (
									<Link
										key={link.path}
										to={link.path}
										className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
											location.pathname === link.path ?
												"bg-amber-600 text-white"
											:	"text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
										}`}>
										{link.name}
									</Link>
								))}
							</div>
						}

						<div className="md:hidden">
							<button
								onClick={() => setIsOpen(!isOpen)}
								className="p-2 rounded-xl text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all">
								{isOpen ?
									<X size={26} />
								:	<Menu size={26} />}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Sidebar Dropdown Panel */}
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					className="md:hidden bg-white border-t shadow-lg">
					<div className="px-4 pt-4 pb-6 space-y-1">
						{navLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={`block py-3 px-4 rounded-xl text-base font-medium ${
									location.pathname === link.path ?
										"text-amber-600 bg-amber-50"
									:	"text-gray-700 hover:text-amber-600 hover:bg-amber-50"
								}`}
								onClick={() => setIsOpen(false)}>
								{link.name}
							</Link>
						))}

						<div className="border-t my-4" />

						{isAuthenticated ?
							<div className="space-y-2 pt-2">
								<div className="px-4 py-2 bg-gray-50 rounded-xl">
									<p className="text-xs text-gray-400 font-semibold uppercase">
										{user?.role}
									</p>
									<p className="text-sm text-gray-700 font-medium truncate">
										{user?.email}
									</p>
								</div>

								{isManagement && (
									<Link
										to="/admin/dashboard"
										onClick={() => setIsOpen(false)}
										className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all">
										<ShieldCheck className="w-5 h-5 text-amber-600" />
										<span>
											{user?.role === "superadmin" ?
												"Superadmin Portal"
											:	"Admin Dashboard"}
										</span>
									</Link>
								)}

								<button
									onClick={() => {
										handleLogout();
										setIsOpen(false);
									}}
									className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all">
									<LogOut className="w-5 h-5" />
									<span>Logout</span>
								</button>
							</div>
						:	<div className="space-y-2 pt-2">
								{authLinks.map((link) => (
									<Link
										key={link.path}
										to={link.path}
										className={`block py-3 px-4 rounded-xl text-base font-medium text-center ${
											location.pathname === link.path ?
												"bg-amber-600 text-white"
											:	"border border-gray-300 text-gray-700 hover:bg-gray-50"
										}`}
										onClick={() => setIsOpen(false)}>
										{link.name}
									</Link>
								))}
							</div>
						}
					</div>
				</motion.div>
			)}
		</motion.nav>
	);
};

export default Navbar;
