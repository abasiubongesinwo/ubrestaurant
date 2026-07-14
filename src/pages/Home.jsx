import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	ShoppingCart,
	Star,
	ChevronRight,
	Flame,
	Clock3,
	ChefHat,
	ShieldCheck,
	UtensilsCrossed,
	Smile,
	Bike,
	Leaf,
} from "lucide-react";

import { toast } from "sonner";

import { api } from "../api";
import Button from "../components/Button";
import Card from "../components/Card";
import Hero from "../components/Hero";
import Section from "../components/Section";
import { formatCurrency } from "../components/utils";
import { useCart } from "../contexts/CartContext";

const Home = () => {
	const { addItem } = useCart();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Proudly Nigerian-Owned Feautures
	const features = [
		{
			icon: ChefHat,
			title: "Professional Chefs",
			description:
				"Experienced chefs preparing authentic Nigerian meals with passion.",
		},
		{
			icon: UtensilsCrossed,
			title: "Fresh Ingredients",
			description:
				"Every meal is made using carefully selected fresh ingredients every day.",
		},
		{
			icon: Bike,
			title: "Fast Delivery",
			description:
				"Hot meals delivered quickly across Lagos while still fresh.",
		},
		{
			icon: ShieldCheck,
			title: "Secure Payments",
			description:
				"Pay safely using Paystack with secure encrypted transactions.",
		},
		{
			icon: Leaf,
			title: "Healthy Choices",
			description:
				"Nutritious meals prepared with premium vegetables and quality proteins.",
		},
		{
			icon: Smile,
			title: "Happy Customers",
			description:
				"Thousands of satisfied customers trust UB Restaurant every week.",
		},
	];

	const statistics = [
		{
			number: "15K+",
			label: "Meals Served",
		},
		{
			number: "4.9★",
			label: "Customer Rating",
		},
		{
			number: "30 mins",
			label: "Average Delivery",
		},
		{
			number: "100%",
			label: "Fresh Ingredients",
		},
	];

	// More relatable Nigerian testimonials
	const testimonials = [
		{
			quote:
				"The jollof rice and chicken tasted exactly like my mother’s! So fresh and delivered hot. Thank you UB!",
			author: "Aisha Bello",
			location: "Lekki Phase 1, Lagos",
		},
		{
			quote:
				"Best pounded yam and egusi soup I’ve had delivered in Lagos. UB Restaurant is now my family’s go-to!",
			author: "Chinedu Okoro",
			location: "Ikoyi, Lagos",
		},
	];

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const data = await api.getProducts();
				const menuItems = data.filter(
					(product) => product.category === "product",
				);
				const homeProducts = (menuItems.length ? menuItems : data).slice(0, 4);
				setProducts(homeProducts);
			} catch {
				setError("Failed to load meals");
				toast.error("Failed to load meals");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const handleAddToCart = (product) => {
		addItem(product);
		toast.success(`${product.title} added to cart!`);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-14 w-14 border-4 border-amber-200 border-t-amber-600"></div>
			</div>
		);
	}

	return (
		<div>
			<Hero />

			{/* Popular Meals */}
			<Section className="bg-gradient-to-b from-amber-50/60 to-white py-16 sm:py-10 px-4">
				<div className="max-w-6xl mx-auto w-full">
					{/* Section Header */}
					<div className="text-center mb-14">
						<span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-5 py-2 rounded-full text-sm font-semibold mb-5">
							<Flame className="w-4 h-4 fill-amber-500" />
							Customer Favorites
						</span>

						<h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
							Popular Meals This Week
						</h2>

						<p className="max-w-2xl mx-auto text-lg text-gray-600 leading-8">
							Experience the rich taste of authentic Nigerian cuisine, freshly
							prepared every day by our professional chefs.
						</p>
					</div>

					{error ?
						<div className="text-center py-12 text-red-600 font-medium bg-red-50 rounded-2xl border border-red-100 max-w-md mx-auto">
							{error}
						</div>
					:	/* Responsive Grid System matching dashboard fluidity */
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
							{products.map((product, index) => (
								<motion.div
									key={product.id || product._id || product.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-50px" }}
									transition={{ duration: 0.5, delay: index * 0.05 }}
									className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full w-full">
									{/* Image Wrapper container */}
									<div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-50">
										<img
											src={product.image}
											alt={product.title}
											loading="lazy"
											decoding="async"
											fetchPriority="low"
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>
										{index === 0 && (
											<div className="absolute top-4 left-4">
												<span className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
													<Flame className="w-3 h-3 fill-white" />
													Best Seller
												</span>
											</div>
										)}
										{/* Premium Floating Badge */}
										<div className="absolute top-4 right-4 bg-white shadow-xl rounded-full px-4 py-2">
											<p className="font-bold text-amber-600">
												{formatCurrency(product.price)}
											</p>
										</div>
									</div>

									{/* Card Content body details */}
									<div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
										<div className="mb-4">
											<h4 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-amber-600 line-clamp-1 transition-colors duration-200">
												{product.title}
											</h4>
											<div className="flex items-center gap-2 mt-2 mb-3">
												<div className="flex text-yellow-400">★★★★★</div>

												<span className="text-sm text-gray-500">4.9</span>
											</div>
											{product.description && (
												<p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
													{product.description}
												</p>
											)}
											<div className="flex justify-between items-center mt-4 text-sm text-gray-500">
												<div className="flex items-center gap-1">
													<Clock3 className="w-4 h-4" />
													<span>20–30 mins</span>
												</div>

												<span className="text-amber-600 font-medium">
													Hot & Fresh
												</span>
											</div>
										</div>

										<Button
											size="md"
											className="w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
											onClick={() => handleAddToCart(product)}>
											<ShoppingCart className="w-5 h-5" /> Add to Cart
										</Button>
									</div>
								</motion.div>
							))}
						</div>
					}

					{/* Bottom Menu Navigation Action Link */}
					<div className="text-center sm:mt-16">
						<Button
							variant="outline"
							size="lg"
							asLink
							to="/services"
							className="group px-8 py-3.5 rounded-2xl">
							<span>Explore Full Menu</span>

							<ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
						</Button>
					</div>
				</div>
			</Section>

			{/* Testimonials */}
			<Section id="testimonials" className="py-5 bg-white">
				<motion.div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						Happy Customers, Real Naija Taste
					</h2>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.author}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.15 }}>
							<Card className="h-full p-10">
								<div className="flex mb-6">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											className="w-5 h-5 fill-amber-400 text-amber-400"
										/>
									))}
								</div>
								<p className="text-lg text-gray-700 italic leading-relaxed mb-8">
									&ldquo;{testimonial.quote}&rdquo;
								</p>
								<div>
									<p className="font-semibold text-gray-900">
										{testimonial.author}
									</p>
									<p className="text-sm text-gray-500">
										{testimonial.location}
									</p>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			</Section>

			{/* Restaurant Statistics */}
			<Section className="py-20 bg-gradient-to-r from-amber-900 to-orange-500 text-white">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
					{statistics.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}>
							<h2 className="text-4xl md:text-5xl font-extrabold mb-2">
								{stat.number}
							</h2>

							<p className="text-white/90 text-lg">{stat.label}</p>
						</motion.div>
					))}
				</div>
			</Section>

			{/* Why Choose UB Restaurant */}
			<Section className="py-24 bg-gray-50">
				<div className="text-center mb-16">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Why Choose UB Restaurant
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-xl text-gray-600 max-w-2xl mx-auto">
						We combine authentic Nigerian recipes, premium ingredients, and
						excellent customer service to give you an unforgettable dining
						experience.
					</motion.p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => {
						const Icon = feature.icon;

						return (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.08 }}>
								<Card className="h-full p-8 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
									<div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
										<Icon className="w-8 h-8 text-amber-500" />
									</div>

									<h3 className="text-2xl font-bold text-gray-900 mb-4">
										{feature.title}
									</h3>

									<p className="text-gray-600 leading-8">
										{feature.description}
									</p>
								</Card>
							</motion.div>
						);
					})}
				</div>
			</Section>

			{/* CTA Section */}
			<Section className="bg-gradient-to-br from-gray-900 to-black text-white py-5">
				<div className="text-center max-w-3xl mx-auto">
					<motion.h2
						className="text-4xl md:text-6xl font-bold mb-6"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}>
						Craving Real Naija Food?
					</motion.h2>
					<p className="text-xl text-gray-300 mb-10">
						Order now and enjoy hot, authentic Nigerian meals delivered fast
					</p>
					<Button
						size="lg"
						variant="primary"
						className="text-xl px-14 py-7"
						asLink
						to="/services">
						Browse Menu & Order Now
					</Button>
				</div>
			</Section>
		</div>
	);
};

export default Home;
