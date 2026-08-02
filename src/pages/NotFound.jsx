import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";
import UbLogo from "/ubrestaurantlogo.png";
import Button from "../components/Button";

const NotFound = () => {
	return (
		<div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-gradient-to-b from-amber-50 via-white to-gray-50">
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35 }}
				className="w-full max-w-2xl rounded-[2rem] border border-amber-100 bg-white/90 p-8 shadow-2xl shadow-amber-100/60 backdrop-blur sm:p-12">
				<div className="flex flex-col items-center text-center">
					<div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-200 bg-amber-50 shadow-sm">
						<img
							src={UbLogo}
							alt="UB Restaurant logo"
							className="h-12 w-12 object-contain"
						/>
					</div>
					<div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
						<SearchX className="h-4 w-4" />
						Page not found
					</div>
					<h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
						We couldn&apos;t find that page
					</h1>
					<p className="mt-4 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
						The page you are looking for may have moved, been removed, or never
						existed. Let us bring you back to the delicious experience at UB
						Restaurant.
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Button asLink to="/" className="px-6 py-3 text-base">
							<Home className="mr-2 h-4 w-4" />
							Back to home
						</Button>
						<Button
							asLink
							to="/services"
							variant="secondary"
							className="px-6 py-3 text-base">
							Browse menu
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default NotFound;
