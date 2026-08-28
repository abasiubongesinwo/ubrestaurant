import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	ArrowRight,
	Eye,
	EyeOff,
	KeyRound,
	LockKeyhole,
	Mail,
	ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import api from "../utils/api";
import UbLogo from "/ubrestaurantlogo.png";

export default function ForgotPassword() {
	const [step, setStep] = useState(1);
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	// =====================================================
	// SEND RESET CODE
	// =====================================================

	const handleForgotPassword = async (e) => {
		e.preventDefault();

		if (loading) return;

		setLoading(true);

		try {
			await api.forgotPassword(email.trim());

			toast.success("Reset code sent to your email.");
			setStep(2);
		} catch (error) {
			toast.error(
				error.message || "Unable to send reset code. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	// =====================================================
	// VERIFY RESET CODE
	// =====================================================

	const handleVerifyCode = async (e) => {
		e.preventDefault();

		if (loading) return;

		if (!/^\d{6}$/.test(code)) {
			toast.error("Enter the 6-digit reset code.");
			return;
		}

		setLoading(true);

		try {
			await api.verifyResetCode(email.trim(), code.trim());

			toast.success("Reset code verified.");
			setStep(3);
		} catch (error) {
			toast.error(error.message || "Invalid or expired reset code.");
		} finally {
			setLoading(false);
		}
	};

	// =====================================================
	// RESET PASSWORD
	// =====================================================

	const handleResetPassword = async (e) => {
		e.preventDefault();

		if (loading) return;

		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters long.");
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		setLoading(true);

		try {
			await api.resetPassword(email.trim(), code.trim(), newPassword);

			toast.success("Password reset successful!");

			setTimeout(() => {
				navigate("/login", { replace: true });
			}, 800);
		} catch (error) {
			toast.error(
				error.message || "Unable to reset password. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	// =====================================================
	// STEP CONTENT
	// =====================================================

	const renderStep = () => {
		// -------------------------------------------------
		// STEP 1 — EMAIL
		// -------------------------------------------------

		if (step === 1) {
			return (
				<form className="space-y-5" onSubmit={handleForgotPassword}>
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

					<button
						type="submit"
						disabled={loading}
						className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-amber-500 px-6 font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60">
						{loading ?
							<>
								<span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
								Sending code...
							</>
						:	<>
								Send reset code
								<ArrowRight
									size={19}
									className="transition-transform group-hover:translate-x-1"
								/>
							</>
						}
					</button>
				</form>
			);
		}

		// -------------------------------------------------
		// STEP 2 — VERIFY CODE
		// -------------------------------------------------

		if (step === 2) {
			return (
				<form className="space-y-5" onSubmit={handleVerifyCode}>
					<div>
						<label
							htmlFor="code"
							className="mb-2 block text-sm font-semibold text-gray-700">
							6-digit reset code
						</label>

						<div className="relative">
							<KeyRound
								size={19}
								className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
							/>

							<input
								id="code"
								type="text"
								inputMode="numeric"
								autoComplete="one-time-code"
								maxLength={6}
								required
								disabled={loading}
								value={code}
								onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
								placeholder="000000"
								className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-center text-xl font-bold tracking-[0.35em] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
							/>
						</div>
					</div>

					<div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
						<p className="text-center text-xs leading-5 text-gray-500">
							We sent a 6-digit code to
						</p>

						<p className="mt-1 text-center text-sm font-bold text-gray-800 break-all">
							{email}
						</p>
					</div>

					<button
						type="submit"
						disabled={loading || code.length !== 6}
						className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-amber-500 px-6 font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:bg-amber-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60">
						{loading ?
							<>
								<span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
								Verifying...
							</>
						:	<>
								Verify code
								<ArrowRight
									size={19}
									className="transition-transform group-hover:translate-x-1"
								/>
							</>
						}
					</button>

					<button
						type="button"
						disabled={loading}
						onClick={() => setStep(1)}
						className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-amber-600">
						<ArrowLeft size={16} />
						Change email
					</button>
				</form>
			);
		}

		// -------------------------------------------------
		// STEP 3 — NEW PASSWORD
		// -------------------------------------------------

		return (
			<form className="space-y-5" onSubmit={handleResetPassword}>
				<div>
					<label
						htmlFor="newPassword"
						className="mb-2 block text-sm font-semibold text-gray-700">
						New password
					</label>

					<div className="relative">
						<LockKeyhole
							size={19}
							className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
						/>

						<input
							id="newPassword"
							type={showPassword ? "text" : "password"}
							autoComplete="new-password"
							required
							disabled={loading}
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="Enter new password"
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
							placeholder="Confirm new password"
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

				<div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
					<p className="text-xs leading-5 text-gray-600">
						Your new password must contain at least{" "}
						<strong>8 characters</strong>.
					</p>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-amber-500 px-6 font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:bg-amber-600 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60">
					{loading ?
						<>
							<span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
							Resetting password...
						</>
					:	<>
							Create new password
							<ArrowRight
								size={19}
								className="transition-transform group-hover:translate-x-1"
							/>
						</>
					}
				</button>
			</form>
		);
	};

	return (
		<main className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-12 sm:py-16">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-center">
				<div className="grid w-full overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.10)] lg:grid-cols-2">
					{/* LEFT SIDE */}

					<div className="relative hidden min-h-[650px] overflow-hidden bg-gray-950 lg:block">
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
							<div>
								<div className="mb-8 flex items-center gap-3">
									<div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
										<img
											src={UbLogo}
											alt="UB Restaurant"
											className="h-full w-full object-contain p-1"
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
										Account security
									</p>

									<h1 className="text-5xl font-black leading-tight text-white">
										Protect your
										<br />
										account.
									</h1>

									<p className="mt-6 max-w-sm text-base leading-7 text-gray-300">
										Reset your password securely and get back to enjoying your
										favorite meals.
									</p>
								</div>
							</div>

							<div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
										<ShieldCheck size={20} />
									</div>

									<div>
										<p className="text-sm font-semibold text-white">
											Secure password recovery
										</p>

										<p className="mt-1 text-xs text-gray-300">
											Your reset code expires after 10 minutes.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* RIGHT SIDE */}

					<div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
						<div className="w-full max-w-md">
							{/* Mobile Logo */}

							<div className="mb-8 flex flex-col items-center text-center lg:hidden">
								<div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
									<img
										src={UbLogo}
										alt="UB Restaurant"
										className="h-full w-full object-contain p-2"
									/>
								</div>

								<h2 className="text-2xl font-bold text-gray-900">
									UB Restaurant
								</h2>

								<p className="mt-1 text-sm text-gray-500">
									Authentic Nigerian Cuisine
								</p>
							</div>

							{/* Icon */}

							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
								{step === 1 ?
									<Mail size={25} />
								: step === 2 ?
									<KeyRound size={25} />
								:	<LockKeyhole size={25} />}
							</div>

							{/* Heading */}

							<div className="mb-8">
								<p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
									{step === 1 ?
										"Password recovery"
									: step === 2 ?
										"Verify code"
									:	"New password"}
								</p>

								<h1 className="text-4xl font-black tracking-tight text-gray-900">
									{step === 1 ?
										"Forgot your password?"
									: step === 2 ?
										"Check your email"
									:	"Create a new password"}
								</h1>

								<p className="mt-3 text-gray-500">
									{step === 1 ?
										"Enter your email and we'll send you a secure reset code."
									: step === 2 ?
										"Enter the 6-digit code we sent to your email."
									:	"Choose a strong new password for your account."}
								</p>
							</div>

							{/* Progress */}

							<div className="mb-8 flex gap-2">
								{[1, 2, 3].map((item) => (
									<div
										key={item}
										className={`h-1.5 flex-1 rounded-full transition ${
											item <= step ? "bg-amber-500" : "bg-gray-100"
										}`}
									/>
								))}
							</div>

							{renderStep()}

							{/* Back to Login */}

							<div className="mt-8 text-center">
								<Link
									to="/login"
									className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-amber-600">
									<ArrowLeft size={16} />
									Back to login
								</Link>
							</div>

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
