import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { api } from "../api";

const PaymentCallback = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate(); // ✅ Initialize router navigation redirect engine
	const { clearCart } = useCart();
	const [status, setStatus] = useState("verifying");

	const reference = searchParams.get("reference");

	useEffect(() => {
		const verifyTransaction = async () => {
			if (!reference) return;

			try {
				const data = await api.verifyPayment(reference);
				console.log("Paystack verification success response:", data);

				if (data.success || data.status === "success") {
					setStatus("success");
					clearCart();

					// ✅ FIX: Wait 3 seconds so they see the success message,
					// then automatically push them out of this raw callback URL!
					setTimeout(() => {
						navigate("/services");
					}, 3500);
				} else {
					setStatus("error");
				}
			} catch (error) {
				console.error("Verification failed:", error);
				setStatus("error");
			}
		};

		verifyTransaction();
	}, [reference, clearCart, navigate]); // ✅ Added navigate dependency tracking

	// 1. LOADING SCREEN
	if (status === "verifying") {
		return (
			<div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50">
				<Loader2 className="w-16 h-16 animate-spin text-amber-500 mb-4" />
				<h2 className="text-2xl font-bold text-gray-800">
					Confirming your payment...
				</h2>
				<p className="text-gray-500">
					Please do not close or refresh this page.
				</p>
			</div>
		);
	}

	// 2. SUCCESS STATE
	if (status === "success") {
		return (
			<div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
				<div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="w-12 h-12 text-green-500" />
					</div>
					<h2 className="text-3xl font-bold text-gray-900 mb-3">
						Payment Successful!
					</h2>
					<p className="text-xl text-emerald-600 font-medium mb-4">
						Thank you for your order!
					</p>
					<p className="text-gray-600 mb-6">
						Your payment was securely processed. We&apos;ve received your order
						items and our kitchen is preparing your delicious meal right now!
					</p>

					{/* Visual Redirect Indicator */}
					<p className="text-xs text-gray-400 animate-pulse mb-4">
						Redirecting you back to the menu shortly...
					</p>

					<Link
						to="/services"
						className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-amber-200">
						Order Something Else
					</Link>
				</div>
			</div>
		);
	}

	// 3. ERROR STATE
	return (
		<div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
			<div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
				<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<XCircle className="w-12 h-12 text-red-500" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Verification Failed
				</h2>
				<p className="text-gray-600 mb-6">
					We couldn&apos;t verify your transaction reference with Paystack. If
					you were debited, please contact our store support.
				</p>
				<Link
					to="/cart"
					className="text-amber-500 font-semibold hover:underline">
					Return to Cart
				</Link>
			</div>
		</div>
	);
};

export default PaymentCallback;
