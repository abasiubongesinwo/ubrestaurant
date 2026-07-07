import Section from "../components/Section";
import Card from "../components/Card";
import Button from "../components/Button";
import { Users, Award, Heart, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
	const whyUs = [
		{
			icon: Users,
			title: "Talented Chefs",
			description:
				"Our Restaurant team serves freshly made meals with authentic recipes and premium ingredients.",
			color: "from-amber-500 to-orange-500",
			bgLight: "bg-amber-50 border-amber-100",
			iconColor: "text-amber-600",
		},
		{
			icon: Award,
			title: "Quality Ingredients",
			description:
				"We source the best local and imported produce to deliver flavor, health, and consistency.",
			color: "from-emerald-500 to-teal-500",
			bgLight: "bg-emerald-50 border-emerald-100",
			iconColor: "text-emerald-600",
		},
		{
			icon: Heart,
			title: "Customer First",
			description:
				"Your meal satisfaction is guaranteed. Pay online or pay on delivery with confidence.",
			color: "from-rose-500 to-pink-500",
			bgLight: "bg-rose-50 border-pink-100",
			iconColor: "text-rose-600",
		},
	];

	const stats = [
		{ number: "15,000+", label: "Orders Delivered", icon: Award },
		{ number: "12+", label: "Years of Service", icon: Clock },
		{ number: "97%", label: "Happy Customers", icon: Heart },
		{ number: "20+", label: "Delivery Zones", icon: MapPin },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<Section className="bg-gradient-to-r from-amber-950 to-amber-900 text-white px-4 py-20 sm:py-28">
				<div className="max-w-5xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}>
						<h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
							Crafting Restaurant-Quality Meals
						</h1>
						<p className="text-lg sm:text-2xl text-amber-100/80 max-w-3xl mx-auto leading-relaxed font-medium">
							Serving fast, convenient, and delicious food for online and
							delivery customers.
						</p>
					</motion.div>
				</div>
			</Section>

			{/* Our Story & Stats Grid */}
			<Section id="story" className="py-16 sm:py-24 px-4 max-w-7xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
					{/* Left Column: Narrative Story text */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="lg:col-span-7 space-y-6">
						<div>
							<span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
								Since 2012
							</span>
							<h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
								Our Story
							</h2>
						</div>

						<Card className="p-6 sm:p-10 border border-gray-100 shadow-sm bg-white rounded-3xl space-y-6">
							<p className="text-base sm:text-lg text-gray-600 leading-relaxed">
								We started as a small home Restaurant with a big goal: to bring
								restaurant-quality dishes to every doorstep. Today, UB
								Restaurant serves thousands weekly with online checkout and safe
								cash-on-delivery options.
							</p>
							<p className="text-base sm:text-lg text-gray-600 leading-relaxed">
								From local classics to global favorites, our menu changes with
								the season while keeping the same high standards of taste,
								hygiene, and delivery speed.
							</p>
						</Card>

						<div className="pt-2">
							<Button
								asLink
								to="/services"
								size="lg"
								className="text-base font-semibold px-8 py-4 rounded-2xl shadow-md shadow-amber-600/10 hover:shadow-lg">
								Explore the Full Menu
							</Button>
						</div>
					</motion.div>

					{/* Right Column: Key Stats Metric Cards */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6 w-full">
						{stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.05 }}
								className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
								<div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-5 border border-amber-100/60">
									<stat.icon className="w-6 h-6 text-amber-600" />
								</div>
								<div className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
									{stat.number}
								</div>
								<div className="text-xs sm:text-sm text-gray-500 font-semibold uppercase tracking-wider">
									{stat.label}
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</Section>

			{/* Why Choose Us Feature Pillars */}
			<Section
				id="mission"
				className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-24 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-12 sm:mb-20">
						<h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
							Why Customers Choose UB Restaurant
						</h2>
						<p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-medium">
							We don’t just feed you — we make your meal moments memorable.
							Online payment, cash on delivery, and 7-day customer support.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
						{whyUs.map((item, index) => (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.05 }}
								className="h-full">
								<Card className="h-full p-6 sm:p-10 border border-gray-100 bg-white rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center">
									{/* Elevated Icon Capsule */}
									<div
										className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${item.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-md group-hover:scale-105 transition-transform duration-300`}>
										<item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
									</div>

									<h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-200">
										{item.title}
									</h3>
									<p className="text-sm sm:text-base text-gray-500 leading-relaxed">
										{item.description}
									</p>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</Section>
		</div>
	);
};

export default About;
