import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
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

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const data = await api.getProducts();
				// Debug: log API response and counts to help diagnose missing items
				console.debug(
					"API /products response (count):",
					data?.length ?? 0,
					data,
				);
				console.debug(
					"Products description presence:",
					data.map((d) => ({
						id: d.id || d._id || d.title,
						hasDescription: !!d.description,
					})),
				);
				console.debug(
					"Unique categories:",
					Array.from(new Set(data.map((d) => d.category))).slice(0, 20),
				);
				// Use full dataset from backend (do not filter by category) so all products show
				setProducts(data);
			} catch (error) {
				console.error(error);
				toast.error("Failed to load menu items");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

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
			<Section className="bg-amber-950 text-white">
				<motion.div
					className="text-center max-w-4xl mx-auto"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}>
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
						Order Delicious Meals Online or Cash on Delivery
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						Browse our menu, place your order, and choose online payment or pay
						when your food arrives.
					</p>
				</motion.div>
			</Section>

			<Section className="py-20">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((item, index) => (
						<motion.div
							key={item.id || item._id || item.title || index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.07 }}>
							<Card className="group h-full flex flex-col p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 border-2 border-gray-200">
								<div className="relative h-36 sm:h-40 md:h-48 lg:h-64 overflow-hidden">
									<img
										src={item.image}
										alt={item.title}
										loading="lazy"
										decoding="async"
										fetchPriority="low"
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
									/>
									{/* <div className="absolute top-4 right-4 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-md"> */}
									<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
										{formatCurrency(item.price)}
									</div>
								</div>

								<div className="p-4 sm:p-6 flex-1 flex flex-col">
									<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
										{item.title}
									</h3>
									<p className="text-gray-600 mb-3 min-h-[48px] text-sm flex-1">
										{item.description || "Delicious meal from our chef."}
									</p>
									<button
										className="w-full flex items-center justify-center gap-2 p-2 rounded-2xl bg-black text-white hover:bg-gray-900 text-sm"
										onClick={() => handleAddToCart(item)}>
										<ShoppingCart className="w-4 h-4" />
										Add to Cart
									</button>
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			</Section>
		</div>
	);
};

export default Services;
