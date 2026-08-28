import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Eye,
	EyeOff,
	LockKeyhole,
	Mail,
	UserRound,
	ArrowRight,
	ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import UbLogo from "/ubrestaurantlogo.png";

export default function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const { register } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (loading) return;

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setLoading(true);

		try {
			await register({
				fullName: name,
				email,
				password,
			});

			// Save email so verification page can recover it
			localStorage.setItem("verificationEmail", email);

			toast.success(
				"Account created! Check your email for the verification code.",
			);

			navigate("/verify-email", {
				state: {
					email,
				},
			});
		} catch (error) {
			console.error("Signup Error:", error);

			toast.error(error.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-12 sm:py-16">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-center">
				<div className="grid w-full overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.10)] lg:grid-cols-2">
					{/* ================================= */}
					{/* LEFT SIDE */}
					{/* ================================= */}

					<div className="relative hidden min-h-[720px] overflow-hidden bg-gray-950 lg:block">
						<img
							src="/login-food.jpg"
							alt="UB Restaurant"
							className="absolute inset-0 h-full w-full object-cover"
							onError={(e) => {
								e.currentTarget.style.display = "none";
							}}
						/>

						<div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-amber-950/70" />

						<div className="relative z-10 flex h-full flex-col justify-between p-12">
							{/* Logo */}

							<div>
								<div className="mb-10 flex items-center gap-3">
									<div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-amber-50 shadow-lg">
										<img
											src={UbLogo}
											alt="UB Restaurant logo"
											className="h-full w-full object-contain"
										/>
									</div>

									<div>
										<h2 className="text-xl font-bold text-white">
											UB Restaurant
										</h2>

										<p className="text-sm text-gray-300">
											Authentic Nigerian Cuisine
										</p>
									</div>
								</div>

								<div className="max-w-md">
									<p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
										Join us
									</p>

									<h1 className="text-5xl font-black leading-tight text-white">
										Good food.
										<br />
										Great experiences.
									</h1>

									<p className="mt-6 max-w-sm text-base leading-7 text-gray-300">
										Create your UB Restaurant account and enjoy a faster,
										simpler way to order your favorite Nigerian meals.
									</p>
								</div>
							</div>

							{/* Bottom Card */}

							<div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
								<div className="flex items-start gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
										<ShieldCheck size={18} />
									</div>

									<div>
										<p className="text-sm font-semibold text-white">
											Your account is protected
										</p>

										<p className="mt-1 text-xs leading-5 text-gray-300">
											Your information is securely handled so you can focus on
											enjoying your meals.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* ================================= */}
					{/* RIGHT SIDE */}
					{/* ================================= */}

					<div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
						<div className="w-full max-w-md">
							{/* Mobile Logo */}

							<div className="mb-8 flex flex-col items-center text-center lg:hidden">
								<div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-amber-500 shadow-lg">
									<img
										src={UbLogo}
										alt="UB Restaurant logo"
										className="h-full w-full object-contain"
									/>
								</div>

								<h2 className="text-2xl font-bold text-gray-900">
									UB Restaurant
								</h2>

								<p className="mt-1 text-sm text-gray-500">
									Authentic Nigerian Cuisine
								</p>
							</div>

							{/* Heading */}

							<div className="mb-8">
								<p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
									Create account
								</p>

								<h1 className="text-4xl font-black tracking-tight text-gray-900">
									Welcome to UB
								</h1>

								<p className="mt-3 text-gray-500">
									Create your account to start ordering your favorite meals.
								</p>
							</div>

							{/* Form */}

							<form className="space-y-5" onSubmit={handleSubmit}>
								{/* Full Name */}

								<div>
									<label
										htmlFor="name"
										className="mb-2 block text-sm font-semibold text-gray-700">
										Full name
									</label>

									<div className="relative">
										<UserRound
											size={19}
											className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
										/>

										<input
											id="name"
											type="text"
											autoComplete="name"
											required
											disabled={loading}
											value={name}
											onChange={(e) => setName(e.target.value)}
											className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
										/>
									</div>
								</div>

								{/* Email */}

								<div>
									<label
										htmlFor="email"
										className="mb-2 block text-sm font-semibold text-gray-700">
										Email address
									</label>

									<div className="relative">
										<Mail
											size={19}
											className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
										/>

										<input
											id="email"
											type="email"
											autoComplete="email"
											required
											disabled={loading}
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
										/>
									</div>
								</div>

								{/* Password */}

								<div>
									<label
										htmlFor="password"
										className="mb-2 block text-sm font-semibold text-gray-700">
										Password
									</label>

									<div className="relative">
										<LockKeyhole
											size={19}
											className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
										/>

										<input
											id="password"
											type={showPassword ? "text" : "password"}
											autoComplete="new-password"
											required
											disabled={loading}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
										/>

										<button
											type="button"
											tabIndex={-1}
											onClick={() => setShowPassword((prev) => !prev)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700">
											{showPassword ?
												<EyeOff size={19} />
											:	<Eye size={19} />}
										</button>
									</div>
								</div>

								{/* Confirm Password */}

								<div>
									<label
										htmlFor="confirmPassword"
										className="mb-2 block text-sm font-semibold text-gray-700">
										Confirm password
									</label>

									<div className="relative">
										<LockKeyhole
											size={19}
											className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
										/>

										<input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											autoComplete="new-password"
											required
											disabled={loading}
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
										/>

										<button
											type="button"
											tabIndex={-1}
											onClick={() => setShowConfirmPassword((prev) => !prev)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700">
											{showConfirmPassword ?
												<EyeOff size={19} />
											:	<Eye size={19} />}
										</button>
									</div>
								</div>

								{/* Submit */}

								<button
									type="submit"
									disabled={loading}
									className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-amber-500 px-6 font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60">
									{loading ?
										<>
											<span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
											Creating account...
										</>
									:	<>
											Create account
											<ArrowRight
												size={19}
												className="transition-transform group-hover:translate-x-1"
											/>
										</>
									}
								</button>
							</form>

							{/* Login */}

							<div className="mt-8 text-center">
								<p className="text-sm text-gray-500">
									Already have an account?{" "}
									<Link
										to="/login"
										className="font-bold text-amber-600 transition hover:text-amber-700">
										Sign in
									</Link>
								</p>
							</div>

							{/* Footer */}

							<p className="mt-8 text-center text-xs text-gray-400">
								© {new Date().getFullYear()} UB Restaurant. All rights reserved.
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
