import { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { CartProvider } from "./contexts/CartContext";
import { AdminProvider } from "./contexts/AdminContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CookieMessage from "./components/CookieMessage";
import WhatsappIcon from "./components/WhatsappIcon";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import PaymentCallback from "./pages/PaymentCallback";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminLayout from "./components/AdminLayout";
import OrderTable from "./components/OrderTable";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";

function AppContent() {
	const location = useLocation();
	const isAdminRoute = location.pathname.startsWith("/admin");

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [location.pathname]);

	return (
		<>
			<div className="min-h-screen bg-gray-50 pb-0">
				<Navbar />

				<AnimatePresence mode="wait">
					<Routes location={location} key={location.pathname}>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/services" element={<Services />} />
						<Route path="/gallery" element={<Gallery />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/payment/callback" element={<PaymentCallback />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/privacy" element={<Privacy />} />

						<Route
							path="/admin"
							element={
								<ProtectedRoute adminOnly={true}>
									{" "}
									<AdminLayout />
								</ProtectedRoute>
							}>
							<Route path="dashboard" element={<AdminDashboard />} />
							<Route path="orders" element={<OrderTable />} />
							<Route path="customers" element={<AdminCustomers />} />
							<Route index element={<AdminDashboard />} />
						</Route>

						<Route path="*" element={<NotFound />} />
					</Routes>
				</AnimatePresence>
			</div>
			{!isAdminRoute && <Footer />}
			<Toaster richColors position="top-center" />
			<CookieMessage />
			<WhatsappIcon />
		</>
	);
}

function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<AdminProvider>
					<Router>
						<AppContent />
					</Router>
				</AdminProvider>
			</CartProvider>
		</AuthProvider>
	);
}

export default App;
