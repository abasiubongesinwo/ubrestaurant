import { motion } from "framer-motion";
import {
	FaPhone,
	FaEnvelope,
	FaMapMarkerAlt,
	FaClock,
	FaInstagram,
	FaFacebookF,
	FaTwitter,
	FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import UbLogo from "/ubrestaurantlogo.png";

const Footer = () => {
	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "About", path: "/about" },
		{ name: "Menu", path: "/services" },
		{ name: "Gallery", path: "/gallery" },
		{ name: "Contact", path: "/contact" },
	];

	const quickLinks = [
		{ name: "Privacy Policy", href: "/privacy" },
		{ name: "Terms of Service", href: "/terms" },
		{ name: "FAQs", href: "/faq" },
	];

	const currentYear = new Date().getFullYear();

	return (
		<motion.footer
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pt-20 pb-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
					<div className="lg:col-span-5">
						<div className="flex gap-5 mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
							<img
								src={UbLogo}
								alt="UB Restaurant Logo"
								loading="eager"
								decoding="async"
								fetchPriority="high"
								className="h-20 w-auto"
							/>
							<p className="text-gray-400 text-lg leading-relaxed max-w-md mb-10">
								Delivering fresh, fast, and flavorful meals across Lagos. Order
								online or pay cash on delivery every time.
							</p>
						</div>

						<div className="flex gap-4">
							{[
								{ icon: FaInstagram, href: "#", label: "Instagram" },
								{ icon: FaFacebookF, href: "#", label: "Facebook" },
								{ icon: FaTwitter, href: "#", label: "Twitter" },
								{
									icon: FaWhatsapp,
									href: "https://wa.me/2348031234567",
									label: "WhatsApp",
								},
							].map((social, index) => (
								<a
									key={index}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="w-12 h-12 bg-gray-800 hover:bg-amber-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
									aria-label={social.label}>
									<social.icon className="w-5 h-5 group-hover:text-white transition-colors" />
								</a>
							))}
						</div>
					</div>

					<div className="lg:col-span-2">
						<h4 className="text-lg font-semibold mb-6 text-amber-400">
							Company
						</h4>
						<ul className="space-y-4">
							{navLinks.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-gray-300 hover:text-white transition-colors duration-200 block text-[15px]">
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="lg:col-span-2">
						<h4 className="text-lg font-semibold mb-6 text-amber-400">Legal</h4>
						<ul className="space-y-4">
							{quickLinks.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className="text-gray-300 hover:text-white transition-colors duration-200 block text-[15px]">
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div className="lg:col-span-3">
						<h4 className="text-lg font-semibold mb-6 text-amber-400">
							Get In Touch
						</h4>
						<div className="space-y-6 text-gray-300">
							<div className="flex gap-4">
								<div className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
									<FaPhone className="w-5 h-5 text-amber-400" />
								</div>
								<div>
									<p className="font-medium text-white">Phone</p>
									<a
										href="tel:+2348031234567"
										className="hover:text-amber-400 transition-colors">
										+234 704 555 9667
									</a>
								</div>
							</div>

							<div className="flex gap-4">
								<div className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
									<FaEnvelope className="w-5 h-5 text-amber-400" />
								</div>
								<div>
									<p className="font-medium text-white">Email</p>
									<a
										href="mailto:hello@ubrestaurant.com"
										className="hover:text-amber-400 transition-colors">
										hello@ubrestaurant.com
									</a>
								</div>
							</div>

							<div className="flex gap-4">
								<div className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
									<FaMapMarkerAlt className="w-5 h-5 text-amber-400" />
								</div>
								<div>
									<p className="font-medium text-white">Store</p>
									<p className="leading-tight">
										12 Adeola Odeku Street,
										<br />
										Victoria Island, Lagos
									</p>
								</div>
							</div>

							<div className="flex gap-4">
								<div className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0">
									<FaClock className="w-5 h-5 text-amber-400" />
								</div>
								<div>
									<p className="font-medium text-white">Business Hours</p>
									<p className="text-sm">Daily: 8:00 AM - 11:00 PM</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-800 mt-16 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
						<div>© {currentYear} UB Restaurant. All rights reserved.</div>
						<div className="flex gap-6">
							<span>
								Made with <b>UB.Dev</b>
							</span>
							<span>Order online or pay cash on delivery</span>
						</div>
					</div>
				</div>
			</div>
		</motion.footer>
	);
};

export default Footer;
