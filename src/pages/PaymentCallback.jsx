import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function PaymentCallback() {
	const [message, setMessage] = useState("Verifying payment...");
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const verifyPayment = async () => {
			const reference = searchParams.get("reference");

			const response = await fetch(
				`http://localhost:5000/api/payment/verify/${reference}`,
			);

			const data = await response.json();

			if (data.success) {
				setMessage("Payment successful! Your order has been placed.");
			} else {
				setMessage("Payment verification failed.");
			}
		};

		verifyPayment();
	}, []);

	return <h2>{message}</h2>;
}

export default PaymentCallback;
