
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappIcon() {
	const phoneNumber = "2347045559667";
	const message = "Hello! I'd like to order from UB Restaurant";

	const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

	return (
		<a
			href={whatsappUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="fixed bottom-6 right-6 z-50 group"
			aria-label="Chat on WhatsApp">
			<div className="relative flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110">
				<FaWhatsapp className="w-9 h-9" />
				<div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping opacity-25"></div>
			</div>

			{/* Tooltip */}
			<div className="absolute bottom-20 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
				Chat with us on WhatsApp
			</div>
		</a>
	);
}
