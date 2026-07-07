import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // ✅ Added to read post-payment URL context flags
import { motion } from "framer-motion";
import { ShoppingCart, Ban } from "lucide-react"; // ✅ Added Ban icon for empty stock parameters
import { toast } from "sonner";
import { api } from "../api";
import Card from "../components/Card";
import Section from "../components/Section";
import { formatCurrency } from "../components/utils";
import { useCart } from "../contexts/CartContext";

const Services = () => {
	const { addItem } = useCart();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams(); // ✅ Catch incoming redirects

	useEffect(() => {
		// 🌟 UX Touch: If they were just redirected here from a successful checkout, celebrate it!
		if (
			searchParams.get("from") === "checkout" ||
			window.location.search.includes("reference")
		) {
			toast.success("Order Placed Successfully!", {
				description: "Our kitchen logs have received your order details.",
				duration: 5000,
			});
			// Clean up the URL parameters so refreshing doesn't re-trigger the toast notifications
			setSearchParams({}, { replace: true });
		}

		const fetchProducts = async () => {
			try {
				setLoading(true);
				const data = await api.getProducts();
				console.debug(
					"API /products response (count):",
					data?.length ?? 0,
					data,
				);
				setProducts(data);
			} catch (error) {
				console.error(error);
				toast.error("Failed to load menu items");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [searchParams, setSearchParams]);

	const handleAddToCart = (item) => {
		addItem(item);
		toast.success(`${item.title} added to your order!`, {
			description: "You can checkout online or pay cash on delivery.",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-14 w-14 border-4 border-amber-200 border-t-amber-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<Section className="bg-gradient-to-r from-amber-950 to-amber-900 text-white px-4 py-16 sm:py-24">
				<motion.div
					className="text-center max-w-4xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
						Order Delicious Meals Online
					</h1>
					<p className="text-base sm:text-xl text-amber-100/80 max-w-2xl mx-auto font-medium">
						Browse our menu, place your order, and choose online payment or pay
						when your food arrives.
					</p>
				</motion.div>
			</Section>

			{/* Menu Grid Section */}
			<Section className="py-12 sm:py-20 px-4 max-w-7xl mx-auto w-full">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
					{products.map((item, index) => {
						const isAvailable =
							item.isAvailable !== false && item.countInStock !== 0;

						return (
							<motion.div
								key={item.id || item._id || item.title || index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-40px" }}
								transition={{
									duration: 0.4,
									delay: Math.min(index * 0.05, 0.3),
								}}
								className="w-full h-full flex">
								<Card className="group w-full flex flex-col overflow-hidden bg-white rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative">
									{/* Image Box */}
									<div className="relative h-52 sm:h-60 w-full overflow-hidden bg-gray-50">
										<img
											src={item.image}
											alt={item.title}
											loading="lazy"
											decoding="async"
											className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isAvailable && "opacity-40 filter grayscale"}`}
										/>

										{/* Status & Price Badges */}
										<div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
											<div className="flex justify-between items-start w-full">
												{
													!isAvailable ?
														<span className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md uppercase tracking-wider">
															Sold Out
														</span>
													:	<div /> /* Empty spacer block */
												}
												<span className="bg-white/90 backdrop-blur-md text-gray-900 px-3.5 py-1.5 rounded-2xl text-sm font-bold shadow-md tracking-wide">
													{formatCurrency(item.price)}
												</span>
											</div>
										</div>
									</div>

									{/* Content Box */}
									<div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
										<div className="space-y-2">
											<h3
												className={`text-lg sm:text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors duration-200 ${!isAvailable && "text-gray-400 line-through"}`}>
												{item.title}
											</h3>
											<p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
												{item.description ||
													"Delicious premium meal crafted freshly by our chefs."}
											</p>
										</div>

										{/* Premium Unified Action Button */}
										<button
											disabled={!isAvailable}
											onClick={() => handleAddToCart(item)}
											className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl font-bold text-sm shadow-sm transition-all duration-200 ${
												isAvailable ?
													"bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/10 hover:shadow-lg hover:shadow-amber-600/20 active:scale-[0.98] cursor-pointer"
												:	"bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
											}`}>
											{isAvailable ?
												<>
													<ShoppingCart className="w-4 h-4" />
													<span>Add to Order</span>
												</>
											:	<>
													<Ban className="w-4 h-4 text-gray-400" />
													<span>Out of Stock</span>
												</>
											}
										</button>
									</div>
								</Card>
							</motion.div>
						);
					})}
				</div>
			</Section>
		</div>
	);
};

export default Services;
