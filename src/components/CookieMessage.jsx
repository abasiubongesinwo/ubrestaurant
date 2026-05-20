import { useState, useEffect } from "react";

export default function CookieMessage() {
	const [isVisible, setIsVisible] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const hasAccepted = localStorage.getItem("ubCookiesAccepted");
		if (!hasAccepted) {
			// Small delay for better UX
			setTimeout(() => {
				setIsVisible(true);
				setIsAnimating(true);
			}, 1500);
		}
	}, []);

	const acceptCookies = () => {
		setIsAnimating(false);
		setTimeout(() => {
			localStorage.setItem("ubCookiesAccepted", "true");
			setIsVisible(false);
		}, 300);
	};

	const rejectCookies = () => {
		setIsAnimating(false);
		setTimeout(() => {
			localStorage.setItem("ubCookiesAccepted", "false");
			setIsVisible(false);
		}, 300);
	};

	if (!isVisible) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6">
			{/* Backdrop Blur */}
			<div
				className={`max-w-2xl w-full bg-zinc-900/95 backdrop-blur-xl border border-amber-900/30 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
					isAnimating ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
				}`}>
				<div className="p-6 md:p-8">
					<div className="flex items-start gap-5">
						{/* Icon */}
						<div className="text-5xl transition-transform duration-700 hover:rotate-12">
							🍪
						</div>

						<div className="flex-1">
							<h3 className="text-2xl font-semibold text-amber-100 mb-2">
								UB RESTAURANT
							</h3>
							<p className="text-zinc-300 leading-relaxed">
								We use cookies to enhance your dining experience, remember your
								preferences, and serve you better. By continuing to browse, you
								accept our use of cookies.
							</p>
							<a
								href="#"
								className="text-amber-400 hover:text-amber-300 text-sm inline-block mt-2 underline underline-offset-4">
								Learn more about our Cookie Policy
							</a>
						</div>
					</div>

					{/* Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 mt-8">
						<button
							onClick={rejectCookies}
							className="flex-1 py-4 px-6 border border-zinc-700 hover:border-zinc-600 text-zinc-300 font-medium rounded-2xl transition-all active:scale-95">
							Reject
						</button>

						<button
							onClick={acceptCookies}
							className="flex-1 py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/30">
							Accept All Cookies
						</button>
					</div>

					<p className="text-center text-zinc-500 text-xs mt-4">
						You can change your preference anytime in settings
					</p>
				</div>
			</div>
		</div>
	);
}
