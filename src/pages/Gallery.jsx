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
			src: "/Tendrons de Poulet _Crack_   Ingrédients _ 500 g de….jpg",
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
			{/* Hero Banner Section */}
			<Section className="bg-gradient-to-r from-amber-950 to-amber-900 text-white px-4 py-16 sm:py-24">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}>
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
							Our Food Gallery
						</h1>
						<p className="text-base sm:text-xl text-amber-100/80 max-w-2xl mx-auto font-medium">
							See what’s cooking in our Restaurant and pick your next meal.
						</p>
					</motion.div>
				</div>
			</Section>

			{/* Filter & Grid Section */}
			<Section className="py-12 sm:py-16 px-4 max-w-7xl mx-auto w-full">
				{/* Control Panel: Categories & Search Bar */}
				<div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 w-full">
					<div className="flex flex-wrap gap-2.5 justify-center md:justify-start w-full md:w-auto">
						{categories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setSelectedCategory(cat.id)}
								className={`px-5 py-2.5 rounded-2xl font-bold transition-all duration-200 text-sm border ${
									selectedCategory === cat.id ?
										"bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/10 scale-[1.02]"
									:	"bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
								}`}>
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
							className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-600 text-base font-medium shadow-sm placeholder-gray-400 transition-colors"
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

				{/* Display Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
					{filteredImages.map((image, index) => (
						<motion.div
							key={image.src}
							initial={{ opacity: 0, y: 15 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-20px" }}
							transition={{
								duration: 0.4,
								delay: Math.min(index * 0.04, 0.25),
							}}
							className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full w-full aspect-[4/3] cursor-pointer">
							{/* Main Image Layer */}
							<img
								src={image.src}
								alt={image.alt}
								loading="lazy"
								decoding="async"
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							/>

							{/* Upper Static Badge */}
							<div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold rounded-xl shadow-sm uppercase tracking-wider border border-gray-100 pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
								{image.category}
							</div>

							{/* Hover Overlay details container */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-5">
								<div className="space-y-2 w-full">
									<h3 className="text-white font-bold text-lg leading-tight line-clamp-1">
										{image.title}
									</h3>
									<span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-xl capitalize">
										{image.category}
									</span>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Empty State Result Block */}
				{filteredImages.length === 0 && (
					<motion.div
						className="text-center py-20 max-w-md mx-auto"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}>
						<Card className="p-10 border border-gray-100 shadow-sm rounded-3xl bg-white">
							<Search className="w-16 h-16 text-gray-300 mx-auto mb-5" />
							<h3 className="text-2xl font-bold text-gray-900 mb-2">
								No results found
							</h3>
							<p className="text-gray-500 text-sm mb-6 leading-relaxed">
								No matching meals found. Try checking your spelling or selecting
								another category.
							</p>
							<button
								onClick={() => {
									setSelectedCategory("all");
									setSearchTerm("");
								}}
								className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-2xl text-sm font-bold shadow-md shadow-amber-600/10 hover:shadow-lg transition-all">
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
