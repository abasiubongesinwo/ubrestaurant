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
			{/* Hero Section */}
			<Section className="bg-amber-950 text-white px-4 py-12 sm:py-20">
				<motion.div
					className="text-center max-w-4xl mx-auto"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}>
					<h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
						Order Delicious Meals Online
					</h1>
					<p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
						Browse our menu, place your order, and choose online payment or pay
						when your food arrives.
					</p>
				</motion.div>
			</Section>

			{/* Menu Grid Section */}
			<Section className="py-10 sm:py-20 px-4 max-w-7xl mx-auto">
				{/* ⚡ FIX: Adjusted responsive grid spacing to handle mobile cleanly without breaking widths */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
					{products.map((item, index) => (
						<motion.div
							key={item.id || item._id || item.title || index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
							className="w-full">
							{/* ⚡ FIX: Use flex-col to force structured vertical stacking on mobile */}
							<Card className="group w-full h-full flex flex-col overflow-hidden bg-white rounded-3xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100">
								{/* Image Box */}
								<div className="relative h-48 sm:h-52 md:h-56 lg:h-64 w-full overflow-hidden bg-gray-100">
									<img
										src={item.image}
										alt={item.title}
										loading="lazy"
										decoding="async"
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
									/>
									<div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-md z-10">
										{formatCurrency(item.price)}
									</div>
								</div>

								{/* Content Box */}
								<div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
									<div className="flex flex-col gap-1.5">
										<h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words line-clamp-2">
											{item.title}
										</h3>
										<p className="text-gray-600 text-sm break-words line-clamp-3 leading-relaxed">
											{item.description || "Delicious meal from our chef."}
										</p>
									</div>

									{/* Action Button */}
									<div className="mt-auto pt-2">
										<button
											className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-black text-white hover:bg-gray-900 active:scale-95 transition-all font-medium text-sm shadow-md"
											onClick={() => handleAddToCart(item)}>
											<ShoppingCart className="w-4 h-4" />
											Add to Cart
										</button>
									</div>
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
