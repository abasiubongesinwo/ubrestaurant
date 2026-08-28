import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Card from "../components/Card";
import Button from "../components/Button";
import { api } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";

export default function VerifyEmail() {
	const location = useLocation();
	const navigate = useNavigate();
	const { completeAuthentication } = useAuth();

	const [email, setEmail] = useState("");
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);
	const [countdown, setCountdown] = useState(0);

	const inputRefs = useRef([]);

	// Get email from signup
	useEffect(() => {
		const emailFromState = location.state?.email;

		if (emailFromState) {
			setEmail(emailFromState);
			localStorage.setItem("verificationEmail", emailFromState);
			return;
		}

		const savedEmail = localStorage.getItem("verificationEmail");

		if (savedEmail) {
			setEmail(savedEmail);
			return;
		}

		toast.error("Verification email not found.");
		navigate("/signup", { replace: true });
	}, [location.state, navigate]);

	// Countdown
	useEffect(() => {
		if (countdown <= 0) return;

		const timer = setInterval(() => {
			setCountdown((current) => current - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown]);

	// Handle individual digit
	const handleCodeChange = (index, value) => {
		const digit = value.replace(/\D/g, "").slice(-1);

		const newCode = [...code];
		newCode[index] = digit;

		setCode(newCode);

		if (digit && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	// Handle backspace
	const handleKeyDown = (index, event) => {
		if (event.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	// Handle pasting the entire code
	const handlePaste = (event) => {
		event.preventDefault();

		const pasted = event.clipboardData
			.getData("text")
			.replace(/\D/g, "")
			.slice(0, 6);

		if (!pasted) return;

		const newCode = ["", "", "", "", "", ""];

		pasted.split("").forEach((digit, index) => {
			newCode[index] = digit;
		});

		setCode(newCode);

		inputRefs.current[Math.min(pasted.length, 5)]?.focus();
	};

	// Verify email
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (loading) return;

		const verificationCode = code.join("");

		if (!email) {
			toast.error("Email address is required.");
			return;
		}

		if (verificationCode.length !== 6) {
			toast.error("Please enter the 6-digit verification code.");
			return;
		}

		setLoading(true);

		try {
			const response = await api.verifyEmail(email, verificationCode);

			// Automatically log the user in after verification
			if (!response.token || !response.user) {
				throw new Error(
					"Verification succeeded, but authentication data is missing.",
				);
			}

			completeAuthentication(response.token, response.user);

			localStorage.removeItem("verificationEmail");

			toast.success("Email verified successfully! You are now logged in.");

			navigate("/", { replace: true });
		} catch (error) {
			toast.error(error.message || "Invalid verification code.");
		} finally {
			setLoading(false);
		}
	};

	// Resend code
	const handleResend = async () => {
		if (resending || countdown > 0 || !email) return;

		setResending(true);

		try {
			await api.resendVerificationCode(email);

			setCode(["", "", "", "", "", ""]);
			inputRefs.current[0]?.focus();

			setCountdown(60);

			toast.success("A new verification code has been sent.");
		} catch (error) {
			toast.error(error.message || "Unable to resend verification code.");
		} finally {
			setResending(false);
		}
	};

	return (
		<main className="min-h-[calc(100vh-220px)] flex items-center justify-center px-4 py-16">
			<Card className="w-full max-w-xl">
				<div className="mb-8 text-center">
					<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
						<svg
							className="h-8 w-8 text-amber-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>

					<h1 className="mb-3 text-4xl font-bold text-gray-900">
						Verify your email
					</h1>

					<p className="text-gray-600">
						We sent a 6-digit verification code to
					</p>

					<p className="mt-1 break-all font-semibold text-gray-900">{email}</p>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-8 flex justify-center gap-2 sm:gap-3">
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(element) => {
									inputRefs.current[index] = element;
								}}
								type="text"
								inputMode="numeric"
								autoComplete={index === 0 ? "one-time-code" : "off"}
								maxLength={1}
								value={digit}
								disabled={loading}
								onChange={(event) =>
									handleCodeChange(index, event.target.value)
								}
								onKeyDown={(event) => handleKeyDown(index, event)}
								onPaste={handlePaste}
								className="h-14 w-11 rounded-2xl border border-gray-200 text-center text-2xl font-bold text-gray-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100 disabled:bg-gray-50 disabled:opacity-60 sm:h-16 sm:w-14"
								aria-label={`Verification digit ${index + 1}`}
							/>
						))}
					</div>

					<Button
						type="submit"
						disabled={loading}
						className="flex w-full cursor-pointer items-center justify-center">
						{loading ? "Verifying..." : "Verify email"}
					</Button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600">Didn't receive the code?</p>

					<button
						type="button"
						onClick={handleResend}
						disabled={resending || countdown > 0}
						className="mt-2 font-semibold text-amber-600 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50">
						{resending ?
							"Sending..."
						: countdown > 0 ?
							`Resend code in ${countdown}s`
						:	"Resend verification code"}
					</button>
				</div>

				<p className="mt-6 text-center text-sm text-gray-600">
					Wrong email?{" "}
					<Link
						to="/signup"
						className="font-semibold text-amber-600 hover:text-amber-700">
						Create a new account
					</Link>
				</p>
			</Card>
		</main>
	);
}
