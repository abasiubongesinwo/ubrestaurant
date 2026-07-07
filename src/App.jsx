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
import Button from "./components/Button";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import AdminSettings from "./pages/AdminSettings";

function AppContent() {
	const location = useLocation();

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
							<Route path="settings" element={<AdminSettings />} />
							<Route index element={<AdminDashboard />} />
						</Route>

						<Route
							path="*"
							element={
								<div className="min-h-[60vh] flex items-center justify-center">
									<div className="text-center p-8 max-w-md">
										<h1 className="text-9xl md:text-6xl font-bold text-gray-900">
											404
										</h1>
										<p className="text-xl text-gray-600 mb-8">Page not found</p>
										<Button as="link" href="/">
											Go Home
										</Button>
									</div>
								</div>
							}
						/>
					</Routes>
				</AnimatePresence>
			</div>
			<Footer />
			<Toaster richColors position="top-right" />
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
