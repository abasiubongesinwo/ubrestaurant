import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	setLoading(true);

	// 	try {
	// 		const user = await login(email, password);
	// 		toast.success("Login successful!");
	// 		const from = location.state?.from?.pathname;
	// 		const destination =
	// 			user?.role === "admin" || user?.role === "superadmin" ?
	// 				"/admin/dashboard"
	// 			:	from || "/";

	// 		navigate(destination, { replace: true });
	// 	} catch (error) {
	// 		toast.error(error.message || "Login failed");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const user = await login(email, password);

			toast.success("Login successful!");

			const from = location.state?.from?.pathname;

			const destination =
				user?.role === "admin" || user?.role === "superadmin" ?
					"/admin/dashboard"
				:	from || "/";

			navigate(destination, { replace: true });
		} catch (error) {
			toast.error(error.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-[calc(100vh-220px)] flex items-center justify-center py-16 px-4">
			<Card className="w-full max-w-xl">
				<div className="mb-8 text-center">
					<h1 className="text-4xl font-bold text-gray-900 mb-3">Sign in</h1>
					<p className="text-gray-600">
						Welcome back! Enter your email and password to continue.
					</p>
				</div>

				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-2">
							Email address
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none"
						/>
					</div>

					<Button
						type="submit"
						className="w-full cursor-pointer"
						disabled={loading}>
						{loading ? "Signing In..." : "Sign In"}
					</Button>
				</form>

				<p className="mt-6 text-sm text-center text-gray-600">
					Don&apos;t have an account?{" "}
					<Link
						to="/signup"
						className="font-semibold text-amber-600 hover:text-amber-700">
						Create one
					</Link>
				</p>
			</Card>
		</main>
	);
}
