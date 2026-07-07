import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaStar } from "react-icons/fa";
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

	// Proudly Nigerian-Owned Highlights
	const highlights = [
		{
			image: "/FreshlyPrepared.png",
			title: "Freshly Prepared",
			description: "Cooked fresh daily with premium local ingredients",
		},
		{
			image: "/DeliveryMan.png",
			title: "Fast Delivery",
			description: "Reliable same-day delivery across Lagos",
		},
		{
			image: "/AuthenticFlavors.png",
			title: "Authentic Flavors",
			description:
				"100% Nigerian Owned • Rich local spices & authentic home-style cooking",
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
					<div className="text-center mb-12 sm:mb-16">
						<h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-4">
							Popular Meals This Week
						</h3>
						<p className="text-base sm:text-lg text-gray-600 font-medium">
							Chef-prepared • Fresh ingredients • Naija flavors
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
									className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full w-full">
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
										{/* Premium Floating Badge */}
										<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-2xl text-sm font-bold shadow-sm tracking-wide">
											{formatCurrency(product.price)}
										</div>
									</div>

									{/* Card Content body details */}
									<div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
										<div className="mb-4">
											<h4 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-amber-600 line-clamp-1 transition-colors duration-200">
												{product.title}
											</h4>
											{product.description && (
												<p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
													{product.description}
												</p>
											)}
										</div>

										<Button
											size="md"
											className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 sm:gap-2.5 rounded-2xl transition-all shadow-md shadow-amber-600/10 hover:shadow-lg hover:shadow-amber-600/20"
											onClick={() => handleAddToCart(product)}>
											<FaShoppingCart className="w-4 h-4" />
											Add to Cart
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
							className="px-8 py-3.5 text-base sm:text-lg font-medium rounded-2xl transition-all border-gray-200 hover:bg-gray-50">
							See Full Menu
						</Button>
					</div>
				</div>
			</Section>

			{/* Testimonials */}
			<Section id="testimonials" className="py-10 bg-white">
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
										<FaStar key={i} className="text-amber-500 w-6 h-6" />
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

			{/* Highlights Section */}
			<Section className="py-20 bg-white">
				<motion.div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						Why People Love UB Restaurant
					</h2>
					<p className="text-xl text-gray-600">
						Proudly Nigerian-owned • Serving authentic local flavors
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{highlights.map((item, index) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}>
							<Card className="h-full overflow-hidden hover:shadow-2xl transition-all group">
								<div className="relative h-64">
									<img
										src={item.image}
										alt={item.title}
										loading="lazy"
										decoding="async"
										fetchPriority="low"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
								</div>

								<div className="p-8 text-center -mt-8 relative bg-white rounded-t-3xl">
									<h3 className="text-2xl font-bold text-gray-900 mb-3">
										{item.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{item.description}
									</p>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			</Section>

			{/* CTA Section */}
			<Section className="bg-gradient-to-br from-gray-900 to-black text-white py-10">
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
