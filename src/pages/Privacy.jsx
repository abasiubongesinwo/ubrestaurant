import { Shield, Lock, Eye, Database, Cookie } from "lucide-react";

const privacySections = [
	{
		title: "Information We Collect",
		items: [
			"We collect personal information such as your full name, email address, phone number, and delivery address when you create an account or place an order.",
			"We also collect order history, payment references, and account preferences to improve your experience.",
			"We do not collect or store your debit or credit card details. All payments are securely processed by trusted third-party payment providers.",
		],
	},
	{
		title: "How We Use Your Information",
		items: [
			"Process and fulfill your food orders.",
			"Manage your account and authenticate your identity.",
			"Provide customer support and respond to inquiries.",
			"Send order confirmations, payment receipts, and delivery updates.",
			"Improve our website, services, and customer experience.",
			"Comply with legal and regulatory obligations.",
		],
	},
	{
		title: "Payment Security",
		items: [
			"All online payments are processed securely through trusted payment gateways.",
			"UB Restaurant never stores your card details, PIN, CVV, or other sensitive payment information.",
			"Payment transactions are protected using industry-standard encryption and security practices.",
		],
	},
	{
		title: "Data Protection",
		items: [
			"We implement appropriate technical and organizational measures to safeguard your personal information.",
			"Your data is protected against unauthorized access, alteration, disclosure, or destruction.",
			"Access to customer information is restricted to authorized personnel only.",
		],
	},
	{
		title: "Cookies & Analytics",
		items: [
			"We use cookies to improve website functionality and enhance your browsing experience.",
			"Cookies help remember your preferences, maintain your session, and analyze website performance.",
			"You may disable cookies through your browser settings, although some features may not function correctly.",
		],
	},
	{
		title: "Information Sharing",
		items: [
			"We do not sell, rent, or trade your personal information.",
			"Information may be shared only with trusted service providers required to process payments, deliver orders, or maintain our services.",
			"We may disclose information when required by law or to protect our legal rights.",
		],
	},
	{
		title: "Data Retention",
		items: [
			"We retain personal information only for as long as necessary to provide our services and comply with legal obligations.",
			"When information is no longer required, it is securely deleted or anonymized.",
		],
	},
	{
		title: "Your Rights",
		items: [
			"You may request access to the personal information we hold about you.",
			"You may update or correct inaccurate information.",
			"You may request deletion of your account, subject to applicable legal requirements.",
			"You may contact us regarding any questions about your privacy.",
		],
	},
	{
		title: "Children's Privacy",
		items: [
			"Our services are not intended for children under the applicable minimum age in your jurisdiction.",
			"We do not knowingly collect personal information from children without appropriate authorization.",
		],
	},
	{
		title: "Changes to This Privacy Policy",
		items: [
			"We may update this Privacy Policy from time to time to reflect changes in our services or legal requirements.",
			"The latest version will always be published on this page with the updated effective date.",
		],
	},
	{
		title: "Contact Us",
		items: [
			"If you have questions or concerns about this Privacy Policy, please contact our support team.",
			"Email: support@ubrestaurant.com",
			"Phone: +234 XXX XXX XXXX",
		],
	},
];

export default function Privacy() {
	return (
		<div className="space-y-8">
			{privacySections.map((section) => (
				<section
					key={section.title}
					className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-5">
						{section.title}
					</h2>

					<ul className="space-y-3">
						{section.items.map((item, index) => (
							<li
								key={index}
								className="flex items-start gap-3 text-gray-600 leading-7">
								<span className="mt-2 h-2 w-2 rounded-full bg-green-600 flex-shrink-0" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}
