import { useState } from "react";
import Section from "../components/Section";
import Card from "../components/Card";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

const Gallery = () => {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");

	const categories = [
		{ id: "all", label: "All Meals" },
		{ id: "modern", label: "Modern" },
		{ id: "classic", label: "Classic" },
		{ id: "comfort", label: "Comfort" },
	];

	const images = [
		{
			src: "/Quick service restaurant interior _ ai generated royalty free stock photo.jpg",
			category: "modern",
			alt: "Modern dining setup",
			title: "Sleek Contemporary Restaurant",
		},
		{
			src: "/Air Fryer Whole Tandoori Chicken.jpg",
			category: "modern",
			alt: "Tandoori chicken platter",
			title: "Tandoori Chicken Special",
		},
		{
			src: "/Italian Pot Roast (Stracotto) - Rich & Tender Comfort Dish.jpg",
			category: "classic",
			alt: "Pot roast meal",
			title: "Italian Pot Roast",
		},
		{
			src: "/Nigerian Fried Rice(LAST FOR DAYS!) - KikiFoodies.jpg",
			category: "comfort",
			alt: "Fried rice meal",
			title: "Nigerian Fried Rice",
		},
		{
			src: "/Nigerian Pepper Soup _ TheFamilyCooking.jpg",
			category: "comfort",
			alt: "Pepper soup meal",
			title: "Pepper Soup",
		},
		{
			src: "/Tasty Oven Grilled Fish Recipe.jpg",
			category: "classic",
			alt: "Grilled fish meal",
			title: "Grilled Fish Dinner",
		},
		{
			src: "/Tendrons de Poulet _Crack_  Ingrédients _ 500 g de….jpg",
			category: "modern",
			alt: "Chicken tenders",
			title: "Crispy Chicken Tenders",
		},
		{
			src: "/Tilapia au Four, Savoureux et Facile à Préparer - Recettes de Cuisine Africaine.jpg",
			category: "comfort",
			alt: "Baked tilapia meal",
			title: "Baked Tilapia",
		},
		{
			src: "/soft food blurred restaurant background.jpg",
			category: "classic",
			alt: "Restaurant ambience",
			title: "Cozy Restaurant Space",
		},
		{
			src: "/Beef Burrito Recipe with Cheese and Fresh Toppings.jpg",
			category: "modern",
			alt: "Burrito meal",
			title: "Beef Burrito",
		},
	];

	const filteredImages = images.filter((image) => {
		const matchesCategory =
			selectedCategory === "all" || image.category === selectedCategory;
		const matchesSearch =
			searchTerm === "" ||
			image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
			image.title.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const clearSearch = () => setSearchTerm("");

	return (
		<div className="min-h-screen bg-gray-50">
			<Section className="pt-32 pb-20">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}>
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-amber-600 bg-clip-text text-transparent mb-6 tracking-tight">
						Our Food Gallery
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						See what’s cooking in our Restaurant and pick your next meal.
					</p>
				</motion.div>

				<div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12">
					<div className="flex flex-wrap gap-3 justify-center lg:justify-start">
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setSelectedCategory(cat.id)}
								className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-sm sm:text-base ${selectedCategory === cat.id ? "bg-amber-600 text-white shadow-lg scale-105" : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200 hover:border-amber-300"}`}>
								{cat.label}
							</button>
						))}
					</div>

					<div className="relative w-full max-w-md">
						<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
							<Search className="w-5 h-5" />
						</div>
						<input
							type="text"
							placeholder="Search meals, flavors, or cuisine..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-500 text-lg placeholder-gray-400"
						/>
						{searchTerm && (
							<button
								onClick={clearSearch}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
								<X className="w-5 h-5" />
							</button>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredImages.map((image, index) => (
						<motion.div
							key={image.src}
							className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: Math.min(index * 0.04, 0.3) }}
							whileHover={{ y: -8 }}>
							<div className="aspect-[4/3] overflow-hidden">
								<img
									src={image.src}
									alt={image.alt}
									loading="lazy"
									decoding="async"
									fetchPriority="low"
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
								/>
							</div>
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
								<div>
									<h3 className="text-white font-semibold text-lg mb-1">
										{image.title}
									</h3>
									<span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full capitalize">
										{image.category}
									</span>
								</div>
							</div>
							<div className="absolute top-4 right-4 px-4 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full shadow">
								{image.category}
							</div>
						</motion.div>
					))}
				</div>

				{filteredImages.length === 0 && (
					<motion.div
						className="text-center py-24"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}>
						<Card className="max-w-md mx-auto p-12">
							<Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
							<h3 className="text-3xl font-bold text-gray-900 mb-3">
								No results found
							</h3>
							<p className="text-gray-600 mb-8">
								No matching meals found. Try another keyword or clear filters.
							</p>
							<button
								onClick={() => {
									setSelectedCategory("all");
									setSearchTerm("");
								}}
								className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-3.5 rounded-2xl font-medium transition-colors">
								Clear Filters & Show All
							</button>
						</Card>
					</motion.div>
				)}
			</Section>
		</div>
	);
};

export default Gallery;
