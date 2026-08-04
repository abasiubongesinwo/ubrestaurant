import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
	{
		question: "How do I place an order?",
		answer:
			"Browse our menu, add your favorite meals to your cart, proceed to checkout, and complete your payment or choose Cash on Delivery if available.",
	},
	{
		question: "What payment methods do you accept?",
		answer:
			"We accept secure online payments through Paystack and Cash on Delivery where available.",
	},
	{
		question: "How long does delivery take?",
		answer:
			"Delivery times vary depending on your location, but most orders are delivered within 30–60 minutes.",
	},
	{
		question: "Can I track my order?",
		answer:
			"Yes. Once your order is confirmed, you'll receive updates about its current status until delivery.",
	},
	{
		question: "Can I cancel my order?",
		answer:
			"Orders may only be cancelled before food preparation begins. Please contact our support team immediately after placing your order.",
	},
	{
		question: "Do you offer refunds?",
		answer:
			"Refunds are reviewed on a case-by-case basis. If there is an issue with your order, contact our support team as soon as possible.",
	},
	{
		question: "How do I create an account?",
		answer:
			"Click the Sign Up button, provide your name, email address, and password, then verify your email if required.",
	},
	{
		question: "I forgot my password. What should I do?",
		answer:
			"Use the 'Forgot Password' option on the login page to receive a secure password reset link.",
	},
	{
		question: "Is my payment information secure?",
		answer:
			"Yes. UB Restaurant uses trusted payment providers and industry-standard encryption to protect your payment information.",
	},
	{
		question: "How can I contact customer support?",
		answer:
			"You can reach our support team via email or phone during our business hours. We're always happy to help.",
	},
];

export default function FAQ() {
	const [active, setActive] = useState(null);

	const toggle = (index) => {
		setActive(active === index ? null : index);
	};

	return (
		<section className="min-h-screen bg-gray-950 text-white py-20 px-6">
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-14">
					<h1 className="text-5xl font-bold text-amber-400 mb-4">
						Frequently Asked Questions
					</h1>

					<p className="text-gray-400 max-w-2xl mx-auto">
						Find answers to the most common questions about ordering, payments,
						deliveries, accounts, and more.
					</p>
				</div>

				<div className="space-y-5">
					{faqs.map((faq, index) => (
						<div
							key={index}
							className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all">
							<button
								onClick={() => toggle(index)}
								className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-800 transition">
								<span className="font-semibold text-lg">{faq.question}</span>

								{active === index ?
									<ChevronUp className="text-amber-400" />
								:	<ChevronDown className="text-amber-400" />}
							</button>

							{active === index && (
								<div className="px-6 pb-6">
									<p className="text-gray-400 leading-8">{faq.answer}</p>
								</div>
							)}
						</div>
					))}
				</div>

				<div className="mt-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl p-10 text-center text-black shadow-xl">
					<h2 className="text-3xl font-bold mb-3">Still Have Questions?</h2>

					<p className="mb-6 max-w-2xl mx-auto">
						If you couldn't find the answer you're looking for, our support team
						is ready to assist you.
					</p>

					<a
						href="mailto:support@ubrestaurant.com"
						className="inline-block bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-900 transition">
						Contact Support
					</a>
				</div>
			</div>
		</section>
	);
}
