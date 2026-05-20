import { motion } from "framer-motion";
import Button from "./Button";
import { Utensils, Calendar } from "lucide-react";

const Hero = () => {
	return (
		<section className="min-h-screen bg-neutral-900 pt-32 pb-24 relative overflow-hidden flex items-center">
			{/* Background Image with Dark Overlay for readability */}
			<div className="absolute inset-0 z-0">
				<img
					src="/Quick service restaurant interior _ ai generated royalty free stock photo.jpg"
					alt="Ambiance of our restaurant"
					loading="eager"
					decoding="async"
					fetchPriority="high"
					className="w-full h-full object-cover object-center opacity-40"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="max-w-4xl mx-auto">
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
						className="text-amber-500 font-medium tracking-widest uppercase mb-4 block">
						Experience Fine Dining
					</motion.span>

					<motion.h1
						className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.8 }}>
						Flavors That <span className="text-amber-500">Inspire</span>
					</motion.h1>

					<motion.p
						className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.8 }}>
						From farm-to-table freshness to artisanal craft cocktails. Join us
						for an unforgettable culinary journey tonight.
					</motion.p>

					{/* Restaurant Specific CTAs */}
					<motion.div
						className="flex flex-col sm:flex-row gap-4 justify-center items-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.8 }}>
						<Button
							asLink
							to="/services"
							className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full flex items-center gap-2 transition-all">
							<Utensils size={20} />
							View Our Menu
						</Button>
						<Button
							asLink
							to="/contact"
							variant="outline"
							className="border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full flex items-center gap-2 transition-all">
							<Calendar size={20} />
							Contact Us
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Hero;
