import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
	AlertCircle,
	Ban,
	Minus,
	Plus,
	Search,
	ShoppingBag,
	Trash2,
	Utensils,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../utils/api";
import { formatCurrency } from "../components/utils";
import { useCart } from "../contexts/CartContext";

const Services = () => {
	const { items, addItem, updateQuantity, removeItem } = useCart();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [query, setQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("all");
	const [searchParams, setSearchParams] = useSearchParams();
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		if (
			searchParams.get("from") === "checkout" ||
			window.location.search.includes("reference")
		) {
			toast.success("Order Placed Successfully!", {
				description: "Our kitchen has received your order details.",
				duration: 5000,
			});
			setSearchParams({}, { replace: true });
		}
	}, [searchParams, setSearchParams]);

	useEffect(() => {
		let active = true;
		api
			.getProducts()
			.then((loadedProducts) => {
				if (!active) return;
				setProducts(loadedProducts);
				setError("");
			})
			.catch((fetchError) => {
				console.error(fetchError);
				if (active)
					setError(fetchError?.message || "The menu couldn't be loaded.");
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, []);

	const retryFetchProducts = async () => {
		setLoading(true);
		setError("");
		try {
			setProducts(await api.getProducts());
		} catch (fetchError) {
			console.error(fetchError);
			setError(fetchError?.message || "The menu couldn't be loaded.");
		} finally {
			setLoading(false);
		}
	};

	const categories = useMemo(
		() => [
			...new Set(
				products.map((product) => product.category?.trim()).filter(Boolean),
			),
		],
		[products],
	);
	const visibleProducts = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return products.filter((product) => {
			const matchesCategory =
				activeCategory === "all" || product.category === activeCategory;
			const searchableText =
				`${product.title || ""} ${product.description || ""} ${product.category || ""}`.toLowerCase();
			return (
				matchesCategory &&
				(!normalizedQuery || searchableText.includes(normalizedQuery))
			);
		});
	}, [products, query, activeCategory]);

	const getCartItem = (product) => {
		const productId = product.id || product._id;
		return items.find(
			(item) => String(item.id || item._id) === String(productId),
		);
	};

	const handleAddToCart = (product) => {
		addItem(product, 1);
		toast.success(`${product.title} added to your order!`, {
			description: "You can checkout online or pay cash on delivery.",
		});
	};

	const handleIncrease = (product) => {
		const cartItem = getCartItem(product);
		if (cartItem) updateQuantity(cartItem.id, cartItem.quantity + 1);
		else addItem(product, 1);
	};

	const handleDecrease = (product) => {
		const cartItem = getCartItem(product);
		if (cartItem) updateQuantity(cartItem.id, cartItem.quantity - 1);
	};

	const handleRemove = (product) => {
		const cartItem = getCartItem(product);
		if (!cartItem) return;
		removeItem(cartItem.id);
		toast.success(`${product.title} removed from your order.`);
	};

	return (
		<div className="min-h-screen bg-stone-50">
			<header className="border-b border-stone-200 bg-white">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
								Made for your table
							</p>
							<h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl">
								Our Menu
							</h1>
							<p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
								Find something you’ll love, add it to your order, and we’ll take
								it from there.
							</p>
						</div>
						<label className="relative block w-full sm:max-w-sm">
							<Search
								aria-hidden="true"
								className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
							/>
							<input
								type="search"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search dishes"
								aria-label="Search menu"
								className="min-h-11 w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
							/>
						</label>
					</div>
					{categories.length > 0 && (
						<div
							className="mt-6 flex gap-2 overflow-x-auto pb-1"
							aria-label="Filter menu by category">
							{["all", ...categories].map((category) => (
								<button
									key={category}
									type="button"
									onClick={() => setActiveCategory(category)}
									aria-pressed={activeCategory === category}
									className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${activeCategory === category ? "border-amber-600 bg-amber-600 text-white" : "border-stone-300 bg-white text-gray-700 hover:border-amber-300 hover:text-amber-800"}`}>
									{category === "all" ? "All dishes" : category}
								</button>
							))}
						</div>
					)}
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
				{loading ?
					<div
						className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
						aria-label="Loading menu">
						{Array.from({ length: 8 }, (_, index) => (
							<div
								key={index}
								className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
								<div className="aspect-[4/3] animate-pulse motion-reduce:animate-none bg-stone-200" />
								<div className="space-y-3 p-5">
									<div className="h-5 w-2/3 animate-pulse motion-reduce:animate-none rounded bg-stone-200" />
									<div className="h-4 w-full animate-pulse motion-reduce:animate-none rounded bg-stone-100" />
									<div className="h-11 animate-pulse motion-reduce:animate-none rounded-xl bg-stone-100" />
								</div>
							</div>
						))}
					</div>
				: error ?
					<div
						role="alert"
						className="flex flex-col items-center rounded-2xl border border-red-200 bg-white px-5 py-14 text-center">
						<AlertCircle className="h-9 w-9 text-red-600" />
						<h2 className="mt-3 text-lg font-bold text-gray-900">
							Menu unavailable
						</h2>
						<p className="mt-1 max-w-md text-sm text-gray-600">{error}</p>
						<button
							type="button"
							onClick={retryFetchProducts}
							className="mt-5 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700">
							Try again
						</button>
					</div>
				: visibleProducts.length === 0 ?
					<div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-14 text-center">
						<Utensils className="h-9 w-9 text-stone-400" />
						<h2 className="mt-3 text-lg font-bold text-gray-900">
							{products.length === 0 ?
								"The menu is being prepared"
							:	"No dishes match your search"}
						</h2>
						<p className="mt-1 max-w-md text-sm text-gray-600">
							{products.length === 0 ?
								"Please check back soon."
							:	"Try a different dish name or category."}
						</p>
						{(query || activeCategory !== "all") && (
							<button
								type="button"
								onClick={() => {
									setQuery("");
									setActiveCategory("all");
								}}
								className="mt-4 text-sm font-bold text-amber-700 hover:text-amber-800">
								Clear filters
							</button>
						)}
					</div>
				:	<>
						<div className="mb-4 flex items-center justify-between gap-3">
							<p className="text-sm font-semibold text-gray-600">
								{visibleProducts.length}{" "}
								{visibleProducts.length === 1 ? "dish" : "dishes"}
							</p>
							<p className="hidden text-xs text-gray-500 sm:block">
								Freshly made when you order
							</p>
						</div>
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{visibleProducts.map((product, index) => {
								const isAvailable =
									product.isAvailable !== false && product.countInStock !== 0;
								const quantity = getCartItem(product)?.quantity || 0;
								return (
									<motion.article
										key={product.id || product._id || product.title || index}
										initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: shouldReduceMotion ? 0 : 0.32,
											delay:
												shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.2),
										}}
										className="h-full">
										<div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg">
											<div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
												{product.image ?
													<img
														src={product.image}
														alt={product.title}
														loading="lazy"
														decoding="async"
														className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none ${isAvailable ? "" : "grayscale opacity-50"}`}
													/>
												:	<div className="flex h-full items-center justify-center text-stone-300">
														<Utensils className="h-10 w-10" />
													</div>
												}
												<div className="pointer-events-none absolute inset-0 flex justify-between p-3">
													{!isAvailable ?
														<span className="h-fit rounded-lg bg-red-700 px-2.5 py-1.5 text-[11px] font-bold uppercase text-white shadow-sm">
															Sold Out
														</span>
													:	<span />}
													<span className="h-fit rounded-lg bg-white/95 px-2.5 py-1.5 text-sm font-extrabold text-gray-950 shadow-sm">
														{formatCurrency(product.price)}
													</span>
												</div>
											</div>
											<div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
												<div className="min-h-[5.25rem]">
													<h2
														className={`line-clamp-1 text-lg font-bold text-gray-950 ${isAvailable ? "" : "text-gray-400"}`}>
														{product.title}
													</h2>
													<p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-relaxed text-gray-600">
														{product.description ||
															"Prepared fresh by our kitchen."}
													</p>
												</div>
												{!isAvailable ?
													<button
														type="button"
														disabled
														className="mt-auto flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm font-bold text-gray-400">
														<Ban className="h-4 w-4" />
														Out of Stock
													</button>
												:	<AnimatePresence mode="wait" initial={false}>
														{quantity === 0 ?
															<motion.button
																key="add"
																type="button"
																onClick={() => handleAddToCart(product)}
																initial={
																	shouldReduceMotion ? false : (
																		{ opacity: 0, y: 4 }
																	)
																}
																animate={{ opacity: 1, y: 0 }}
																exit={{ opacity: 0, y: -4 }}
																transition={{
																	duration: shouldReduceMotion ? 0 : 0.16,
																}}
																className="mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700 active:scale-[0.99] motion-reduce:transition-none">
																<ShoppingBag className="h-4 w-4" />
																Add to Order
															</motion.button>
														:	<motion.div
																key="quantity"
																initial={
																	shouldReduceMotion ? false : (
																		{ opacity: 0, y: 4 }
																	)
																}
																animate={{ opacity: 1, y: 0 }}
																exit={{ opacity: 0, y: -4 }}
																transition={{
																	duration: shouldReduceMotion ? 0 : 0.16,
																}}
																className="mt-auto space-y-2">
																<div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3">
																	<button
																		type="button"
																		onClick={() => handleDecrease(product)}
																		className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-300 bg-white text-gray-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800 active:scale-95 motion-reduce:transition-none"
																		aria-label={`Decrease ${product.title} quantity`}>
																		<Minus className="h-4 w-4" />
																	</button>
																	<div
																		aria-live="polite"
																		className="flex h-11 items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
																		<motion.span
																			key={quantity}
																			initial={
																				shouldReduceMotion ? false : (
																					{ opacity: 0.6, y: 3 }
																				)
																			}
																			animate={{ opacity: 1, y: 0 }}
																			transition={{
																				duration: shouldReduceMotion ? 0 : 0.14,
																			}}
																			className="text-base font-extrabold text-gray-950">
																			{quantity}
																		</motion.span>
																	</div>
																	<button
																		type="button"
																		onClick={() => handleIncrease(product)}
																		className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600 text-white transition hover:bg-amber-700 active:scale-95 motion-reduce:transition-none"
																		aria-label={`Increase ${product.title} quantity`}>
																		<Plus className="h-4 w-4" />
																	</button>
																</div>
																<button
																	type="button"
																	onClick={() => handleRemove(product)}
																	className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-700 motion-reduce:transition-none">
																	<Trash2 className="h-3.5 w-3.5" />
																	Remove
																</button>
															</motion.div>
														}
													</AnimatePresence>
												}
											</div>
										</div>
									</motion.article>
								);
							})}
						</div>
					</>
				}
			</main>
		</div>
	);
};

export default Services;
