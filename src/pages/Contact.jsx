import { useState } from "react";
import Section from "../components/Section";
import Card from "../components/Card";
import Button from "../components/Button";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) newErrors.name = "Please enter your full name";
		if (!formData.email.trim()) newErrors.email = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "Please enter a valid email";
		if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
		if (!formData.message.trim())
			newErrors.message = "Please tell us what you want to order";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			setIsSubmitting(true);

			try {
				await new Promise((resolve) => setTimeout(resolve, 1200));
				setIsSubmitted(true);
				setFormData({ name: "", email: "", phone: "", message: "" });
			} catch (error) {
				console.error("Submission error:", error);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
	};

	const contactInfo = [
		{
			icon: Phone,
			title: "Call Us",
			value: "+234 704 555 9667",
			sub: "Mon - Sun, 8am - 11pm",
		},
		{
			icon: Mail,
			title: "Email Us",
			value: "hello@ubrestaurant.com",
			sub: "Fast replies within 60 min",
		},
		{
			icon: MapPin,
			title: "Visit Our Restaurant",
			value: "12 Adeola Odeku Street, Victoria Island, Lagos",
			sub: "Pick-up and dine-in available",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Header Context Banner */}
			<Section className="bg-gradient-to-r from-amber-950 to-amber-900 text-white px-4 py-16 sm:py-24">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}>
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
							Order or Send Us a Request
						</h1>
						<p className="text-base sm:text-xl text-amber-100/80 max-w-2xl mx-auto font-medium">
							Need help with catering, delivery schedule, or custom meals? We
							are here to help.
						</p>
					</motion.div>
				</div>
			</Section>

			{/* Core Interaction Layer */}
			<Section className="py-12 sm:py-16 px-4 max-w-7xl mx-auto w-full">
				{isSubmitted ?
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						className="max-w-lg mx-auto">
						<Card className="text-center p-8 sm:p-16 border border-gray-100 shadow-xl bg-white rounded-3xl">
							<div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<Send className="w-10 h-10 text-emerald-600" />
							</div>
							<h2 className="text-3xl font-extrabold text-gray-900 mb-3">
								Thank You!
							</h2>
							<p className="text-base text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
								Your request has been received. We’ll contact you shortly about
								your order.
							</p>
							<Button
								onClick={() => setIsSubmitted(false)}
								size="lg"
								className="w-full sm:w-auto px-10 rounded-xl font-bold shadow-md shadow-amber-600/10">
								Send Another Request
							</Button>
						</Card>
					</motion.div>
				:	<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
						{/* Form Frame Block */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="lg:col-span-7 w-full">
							<Card className="p-6 sm:p-10 lg:p-12 border border-gray-100 bg-white rounded-3xl shadow-sm">
								<h3 className="text-2xl font-extrabold text-gray-900 mb-2">
									Send us a message
								</h3>
								<p className="text-sm text-gray-500 mb-8">
									Tell us your order or inquire about a custom package.
								</p>

								<form onSubmit={handleSubmit} className="space-y-5">
									<div>
										<label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
											Full Name *
										</label>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleChange}
											className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-base font-medium transition-all ${
												errors.name ?
													"border-red-300 focus:ring-red-500/10 focus:border-red-400"
												:	"border-gray-200 focus:ring-amber-500/10 focus:border-amber-600"
											}`}
										/>
										{errors.name && (
											<p className="mt-1.5 text-xs font-medium text-red-500">
												{errors.name}
											</p>
										)}
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<div>
											<label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
												Email Address *
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-base font-medium transition-all ${
													errors.email ?
														"border-red-300 focus:ring-red-500/10 focus:border-red-400"
													:	"border-gray-200 focus:ring-amber-500/10 focus:border-amber-600"
												}`}
											/>
											{errors.email && (
												<p className="mt-1.5 text-xs font-medium text-red-500">
													{errors.email}
												</p>
											)}
										</div>

										<div>
											<label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
												Phone Number *
											</label>
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-base font-medium transition-all ${
													errors.phone ?
														"border-red-300 focus:ring-red-500/10 focus:border-red-400"
													:	"border-gray-200 focus:ring-amber-500/10 focus:border-amber-600"
												}`}
											/>
											{errors.phone && (
												<p className="mt-1.5 text-xs font-medium text-red-500">
													{errors.phone}
												</p>
											)}
										</div>
									</div>

									<div>
										<label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
											Tell us about your order *
										</label>
										<textarea
											name="message"
											rows="5"
											value={formData.message}
											onChange={handleChange}
											className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-base font-medium transition-all resize-none ${
												errors.message ?
													"border-red-300 focus:ring-red-500/10 focus:border-red-400"
												:	"border-gray-200 focus:ring-amber-500/10 focus:border-amber-600"
											}`}
											placeholder="I want 5 plates of jollof rice and chicken, for delivery at 7pm..."
										/>
										{errors.message && (
											<p className="mt-1.5 text-xs font-medium text-red-500">
												{errors.message}
											</p>
										)}
									</div>

									<div className="pt-2">
										<Button
											type="submit"
											size="lg"
											className="w-full py-3.5 rounded-xl font-bold text-base shadow-md shadow-amber-600/10 hover:shadow-lg transition-all"
											disabled={isSubmitting}>
											{isSubmitting ? "Sending Request..." : "Send Request"}
										</Button>
									</div>
								</form>
							</Card>
						</motion.div>

						{/* Informational Pillar Grid */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className="lg:col-span-5 space-y-4 w-full">
							{contactInfo.map((info, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.05 }}
									className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-4">
									<div className="w-11 h-11 bg-amber-50 border border-amber-100/60 rounded-xl flex items-center justify-center flex-shrink-0">
										<info.icon className="w-5 h-5 text-amber-600" />
									</div>
									<div className="space-y-0.5">
										<p className="text-gray-900 font-bold text-sm">
											{info.title}
										</p>
										<p className="text-gray-700 font-medium text-sm leading-snug">
											{info.value}
										</p>
										<p className="text-gray-400 text-xs font-medium pt-0.5">
											{info.sub}
										</p>
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				}
			</Section>
		</div>
	);
};

export default Contact;
