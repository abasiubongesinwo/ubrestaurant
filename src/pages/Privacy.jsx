import {
	ShieldCheck,
	Lock,
	CreditCard,
	Mail,
	Cookie,
	UserCheck,
} from "lucide-react";

export default function Privacy() {
	const sections = [
		{
			icon: <UserCheck className="w-7 h-7 text-amber-500" />,
			title: "Information We Collect",
			content:
				"We collect information such as your name, email address, phone number, delivery address, account details and order history when you use our services.",
		},
		{
			icon: <Lock className="w-7 h-7 text-amber-500" />,
			title: "How We Use Your Information",
			content:
				"Your information helps us process orders, deliver meals, manage your account, improve our services, communicate with you and keep your account secure.",
		},
		{
			icon: <CreditCard className="w-7 h-7 text-amber-500" />,
			title: "Payment Security",
			content:
				"Payments are securely processed through trusted payment providers. UB Restaurant never stores your debit card number, CVV or PIN.",
		},
		{
			icon: <Mail className="w-7 h-7 text-amber-500" />,
			title: "Email Communication",
			content:
				"We may send order confirmations, receipts, password reset emails and important account notifications. Promotional emails are optional.",
		},
		{
			icon: <Cookie className="w-7 h-7 text-amber-500" />,
			title: "Cookies",
			content:
				"We use cookies to improve performance, remember your preferences, maintain login sessions and enhance your browsing experience.",
		},
		{
			icon: <ShieldCheck className="w-7 h-7 text-amber-500" />,
			title: "Your Privacy Rights",
			content:
				"You may request access, correction or deletion of your personal information in accordance with applicable laws.",
		},
	];

	return (
		<div className="bg-gradient-to-br from-slate-950 via-slate-900 to-black min-h-screen text-white">
			{/* Hero */}

			<div className="relative overflow-hidden border-b border-white/10">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.15),transparent_60%)]" />

				<div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
					<div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/30 mb-8">
						<ShieldCheck className="w-12 h-12 text-amber-400" />
					</div>

					<h1 className="text-5xl md:text-6xl font-extrabold mb-6">
						Privacy Policy
					</h1>

					<p className="text-slate-300 max-w-3xl mx-auto text-lg leading-8">
						Your privacy matters to us. This Privacy Policy explains how UB
						Restaurant collects, uses and protects your personal information
						whenever you use our services.
					</p>

					<div className="mt-8 inline-flex rounded-full bg-amber-500/10 border border-amber-500/20 px-6 py-2 text-amber-300">
						Effective Date • August 4, 2026
					</div>
				</div>
			</div>

			{/* Sections */}

			<div className="max-w-6xl mx-auto px-6 py-20">
				<div className="grid md:grid-cols-2 gap-8">
					{sections.map((section, index) => (
						<div
							key={index}
							className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-amber-500/50 hover:-translate-y-1 transition duration-300">
							<div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
								{section.icon}
							</div>

							<h2 className="text-2xl font-bold mb-4">{section.title}</h2>

							<p className="text-slate-300 leading-8">{section.content}</p>
						</div>
					))}
				</div>

				{/* Contact */}

				<div className="mt-20 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-10">
					<h2 className="text-3xl font-bold mb-6">
						Questions About Your Privacy?
					</h2>

					<p className="text-slate-300 leading-8 mb-8">
						If you have any questions regarding this Privacy Policy or the way
						your personal information is handled, please contact our support
						team.
					</p>

					<div className="grid md:grid-cols-3 gap-6">
						<div className="rounded-2xl bg-white/5 p-6">
							<h3 className="font-semibold text-amber-400 mb-2">Email</h3>
							<p>support@ubrestaurant.com</p>
						</div>

						<div className="rounded-2xl bg-white/5 p-6">
							<h3 className="font-semibold text-amber-400 mb-2">Website</h3>
							<p>www.ubrestaurant.com</p>
						</div>

						<div className="rounded-2xl bg-white/5 p-6">
							<h3 className="font-semibold text-amber-400 mb-2">Support</h3>
							<p>Monday – Sunday</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
