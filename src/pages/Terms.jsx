import React from "react";

export default function Terms() {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-300 py-24">
			<div className="max-w-5xl mx-auto px-6">
				<div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
					<div className="bg-gradient-to-r from-amber-500 to-orange-500 p-10 text-center">
						<h1 className="text-4xl md:text-5xl font-bold text-white">
							Terms & Conditions
						</h1>

						<p className="text-amber-100 mt-4 text-lg">
							Please read these Terms and Conditions carefully before using UB
							Restaurant.
						</p>

						<p className="text-amber-200 text-sm mt-4">
							Last Updated: August 2026
						</p>
					</div>

					<div className="p-8 md:p-12 space-y-10">
						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								1. Acceptance of Terms
							</h2>

							<p className="leading-8">
								By accessing or using the UB Restaurant website or placing an
								order through our platform, you agree to be bound by these Terms
								and Conditions. If you do not agree with any part of these
								terms, please do not use our services.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								2. Eligibility
							</h2>

							<p className="leading-8">
								You must be at least 18 years old or have permission from a
								parent or legal guardian to use our services.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								3. User Accounts
							</h2>

							<p className="leading-8">
								You are responsible for maintaining the confidentiality of your
								account credentials and for all activities that occur under your
								account. Please notify us immediately if you believe your
								account has been compromised.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								4. Orders
							</h2>

							<p className="leading-8">
								All orders are subject to availability and acceptance. We
								reserve the right to refuse or cancel any order due to pricing
								errors, unavailable products, suspected fraud, or other
								legitimate reasons.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								5. Pricing & Payments
							</h2>

							<p className="leading-8">
								All prices displayed on our website are in Nigerian Naira (₦)
								unless otherwise stated. Payments are processed securely through
								our payment partners. We do not store your payment card
								information.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								6. Delivery
							</h2>

							<p className="leading-8">
								Estimated delivery times are provided for convenience and may
								vary due to weather, traffic, demand, or unforeseen
								circumstances. UB Restaurant is not liable for reasonable delays
								beyond our control.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								7. Cancellations & Refunds
							</h2>

							<p className="leading-8">
								Orders may only be cancelled before food preparation begins.
								Approved refunds will be processed using the original payment
								method where applicable.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								8. Intellectual Property
							</h2>

							<p className="leading-8">
								All content on this website, including logos, graphics, text,
								images, menus, and software, is the property of UB Restaurant
								and is protected by applicable intellectual property laws.
								Unauthorized use is prohibited.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								9. Limitation of Liability
							</h2>

							<p className="leading-8">
								UB Restaurant shall not be liable for indirect, incidental,
								special, or consequential damages arising from the use of our
								website or services, except where required by law.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								10. Privacy
							</h2>

							<p className="leading-8">
								Your use of our services is also governed by our Privacy Policy,
								which explains how we collect, use, and protect your personal
								information.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								11. Changes to These Terms
							</h2>

							<p className="leading-8">
								We reserve the right to modify these Terms and Conditions at any
								time. Updated versions will be posted on this page with the
								revised effective date.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-amber-400 mb-4">
								12. Contact Information
							</h2>

							<p className="leading-8">
								If you have any questions regarding these Terms and Conditions,
								please contact us:
							</p>

							<div className="mt-6 bg-slate-800 border border-slate-700 rounded-2xl p-6">
								<p>
									<strong className="text-white">UB Restaurant</strong>
								</p>
								<p>Email: support@ubrestaurant.com</p>
								<p>Phone: +234 704 555 9667</p>
								<p>Website: www.ubrestaurant.com</p>
							</div>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
