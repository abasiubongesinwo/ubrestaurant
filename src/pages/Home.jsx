import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
	ArrowDown,
	ArrowRight,
	ArrowUpRight,
	Check,
	ChefHat,
	Clock3,
	Flame,
	Leaf,
	Minus,
	Plus,
	Quote,
	ShieldCheck,
	ShoppingBag,
	Star,
	Truck,
	UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../utils/api";
import { formatCurrency } from "../components/utils";
import { useCart } from "../contexts/CartContext";

const reviews = [
	{
		quote:
			"The jollof rice tastes like Sunday at home. Everything arrived hot, generous, and beautifully packed.",
		name: "Aisha B.",
		area: "Lekki, Lagos",
	},
	{
		quote:
			"Proper Nigerian food, made with care. The grilled fish and pepper sauce are now a regular order.",
		name: "Chinedu O.",
		area: "Ikoyi, Lagos",
	},
	{
		quote:
			"Quick delivery and the portions are worth it. UB has become our family’s Friday treat.",
		name: "Tomi A.",
		area: "Victoria Island, Lagos",
	},
];

const promises = [
	{
		icon: ChefHat,
		title: "Made fresh, every time",
		description:
			"Our kitchen prepares your meal to order, never from a pile of yesterday’s food.",
	},
	{
		icon: Leaf,
		title: "Ingredients with integrity",
		description:
			"Good produce, honest portions, and the familiar flavours we grew up with.",
	},
	{
		icon: Truck,
		title: "On its way while it’s hot",
		description:
			"Careful packing and quick local delivery bring the kitchen straight to you.",
	},
];

const Home = () => {
	const { items, addItem, updateQuantity } = useCart();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		let isActive = true;

		const fetchProducts = async () => {
			try {
				const data = await api.getProducts();
				const menuItems = data.filter(
					(product) => product.category === "product",
				);

				if (isActive) {
					setProducts((menuItems.length ? menuItems : data).slice(0, 4));
				}
			} catch (fetchError) {
				console.error("Failed to load featured meals:", fetchError);
				if (isActive) setError(true);
			} finally {
				if (isActive) setLoading(false);
			}
		};

		void fetchProducts();
		return () => {
			isActive = false;
		};
	}, []);

	const getCartItem = (product) => {
		const productId = product.id ?? product._id;
		return items.find(
			(item) => String(item.id ?? item._id) === String(productId),
		);
	};

	const handleAdd = (product) => {
		addItem(product);
		toast.success(`${product.title} added to your bag`);
	};

	const handleQuantity = (product, change) => {
		const cartItem = getCartItem(product);
		if (!cartItem && change > 0) {
			addItem(product);
			return;
		}
		if (cartItem) updateQuantity(cartItem.id, cartItem.quantity + change);
	};

	return (
		<main className="bg-[#f7f1e7] text-[#1b2d26]">
			<section className="relative isolate flex min-h-[min(780px,calc(100svh-4rem))] items-end overflow-hidden bg-[#173d2d] text-white">
				<img
					src="/Nigerian Fried Rice(LAST FOR DAYS!) - KikiFoodies.jpg"
					alt="A generous platter of Nigerian fried rice and grilled chicken"
					fetchPriority="high"
					className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
				/>
				<div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101713]/90 via-[#101713]/60 to-[#101713]/10" />
				<div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101713]/65 via-transparent to-[#101713]/10" />

				<div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-end gap-12 px-5 pb-14 pt-24 sm:px-8 sm:pb-20 lg:grid-cols-[1fr_auto] lg:px-16 lg:pb-24">
					<motion.div
						initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: shouldReduceMotion ? 0 : 0.65 }}
						className="max-w-3xl">
						<div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f2a524] sm:text-sm">
							<span className="h-px w-9 bg-[#f2a524]" />
							Lagos, Nigeria · Made with heart
						</div>
						<h1 className="max-w-3xl font-serif text-[clamp(3.1rem,8vw,6.8rem)] font-medium leading-[0.98] text-white">
							A taste of home,
							<span className="mt-2 block italic text-[#f2a524]">
								wherever you are.
							</span>
						</h1>
						<p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
							From smoky party jollof to slow-simmered soups, find the Nigerian
							comfort food you love, freshly made and brought to your door.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link to="/services" className="pro-button-primary group">
								Explore the menu
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Link>
							<a href="#favorites" className="pro-button-secondary group">
								See what’s cooking
								<ArrowDown className="h-4 w-4" />
							</a>
						</div>
					</motion.div>

					<div className="hidden w-60 border-l border-white/35 pl-6 pb-1 lg:block">
						<div className="flex items-center gap-1 text-[#f2a524]">
							{Array.from({ length: 5 }, (_, index) => (
								<Star key={index} className="h-4 w-4 fill-current" />
							))}
						</div>
						<p className="mt-3 font-serif text-2xl">Good food. Good feeling.</p>
						<p className="mt-2 text-sm leading-6 text-white/65">
							A little Lagos warmth, delivered fresh.
						</p>
					</div>
				</div>
				<div className="absolute bottom-5 right-6 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 sm:flex lg:right-10">
					<UtensilsCrossed className="h-3.5 w-3.5" />
					Real food, real generous
				</div>
			</section>

			<div className="border-b border-[#d9d1c1] bg-[#f3e9d4]">
				<div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-[#d9d1c1] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-16">
					<div className="flex items-center gap-3 py-5 sm:justify-center">
						<Clock3 className="h-5 w-5 text-[#2d6b3f]" />
						<div>
							<p className="text-sm font-bold text-[#1b2d26]">
								Freshly prepared
							</p>
							<p className="text-xs text-[#496353]">Made when you order</p>
						</div>
					</div>
					<div className="flex items-center gap-3 py-5 sm:justify-center sm:px-4">
						<Truck className="h-5 w-5 text-[#2d6b3f]" />
						<div>
							<p className="text-sm font-bold text-[#1b2d26]">
								Fast Lagos delivery
							</p>
							<p className="text-xs text-[#496353]">
								Packed hot, sent with care
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3 py-5 sm:justify-center">
						<ShieldCheck className="h-5 w-5 text-[#2d6b3f]" />
						<div>
							<p className="text-sm font-bold text-[#1b2d26]">
								Secure checkout
							</p>
							<p className="text-xs text-[#496353]">
								Simple, protected payment
							</p>
						</div>
					</div>
				</div>
			</div>

			<section
				id="favorites"
				className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-16">
				<div className="mx-auto max-w-[1440px]">
					<div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
						<div className="max-w-2xl">
							<p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#d7831a]">
								<Flame className="h-4 w-4" /> Straight from our kitchen
							</p>
							<h2 className="font-serif text-4xl leading-tight text-[#1b2d26] sm:text-5xl">
								The ones everyone comes back for.
							</h2>
							<p className="mt-4 max-w-xl text-base leading-7 text-[#496353]">
								A few house favourites to get you started. Big flavour, made
								fresh, and ready for your table.
							</p>
						</div>
						<Link
							to="/services"
							className="group inline-flex items-center gap-2 self-start border-b border-[#d7831a] pb-1 text-sm font-bold text-[#2d6b3f] transition-colors hover:text-[#173d2d] sm:self-auto">
							Browse the full menu{" "}
							<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
						</Link>
					</div>

					{loading ?
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
							{Array.from({ length: 4 }, (_, index) => (
								<div
									key={index}
									className="aspect-[0.82] animate-pulse bg-[#ebdfc3]"
								/>
							))}
						</div>
					: error ?
						<div className="border border-[#d9d1c1] bg-[#fffaf3] px-6 py-12 text-center">
							<p className="font-serif text-2xl text-[#1b2d26]">
								Our menu is taking a breather.
							</p>
							<p className="mt-2 text-sm text-[#496353]">
								Please visit the full menu to try again.
							</p>
							<Link
								to="/services"
								className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2d6b3f]">
								Open menu <ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					: products.length === 0 ?
						<div className="border border-[#d9d1c1] bg-[#fffaf3] px-6 py-12 text-center">
							<p className="font-serif text-2xl text-[#1b2d26]">
								Something lovely is on the way.
							</p>
							<p className="mt-2 text-sm text-[#496353]">
								Our featured plates will be back on the menu soon.
							</p>
						</div>
					:	<div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
							{products.map((product, index) => {
								const quantity = getCartItem(product)?.quantity ?? 0;
								return (
									<motion.article
										key={product.id || product._id || product.title}
										initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, margin: "-40px" }}
										transition={{
											duration: shouldReduceMotion ? 0 : 0.42,
											delay: index * 0.07,
										}}
										className="group min-w-0 overflow-hidden rounded-[28px] border border-[#e4dcc8] bg-[#fffaf3] p-3 shadow-[0_18px_38px_rgba(23,61,45,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(23,61,45,0.1)]">
										<div className="relative overflow-hidden rounded-[22px] bg-[#e8e4d9]">
											<div className="relative aspect-[0.88] overflow-hidden">
												<img
													src={
														product.image ||
														"/Nigerian Fried Rice(LAST FOR DAYS!) - KikiFoodies.jpg"
													}
													alt={product.title}
													loading="lazy"
													decoding="async"
													className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
												/>
												{index === 0 && (
													<span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#f3efe4]/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#69491d] backdrop-blur-sm">
														<Flame className="h-3 w-3" /> Crowd favourite
													</span>
												)}
												<span className="absolute bottom-3 right-3 rounded-full bg-[#f3efe4]/95 px-3 py-1.5 text-xs font-bold text-[#20251e] backdrop-blur-sm">
													{formatCurrency(product.price)}
												</span>
											</div>
										</div>
										<div className="flex items-start justify-between gap-3 pt-4">
											<div className="min-w-0">
												<h3 className="truncate font-serif text-xl text-[#1b2d26]">
													{product.title}
												</h3>
												<div className="mt-1 flex items-center gap-1.5 text-xs text-[#496353]">
													<span className="flex text-[#f2a524]">
														{Array.from({ length: 5 }, (_, star) => (
															<Star
																key={star}
																className="h-3 w-3 fill-current"
															/>
														))}
													</span>
													<span>Guest favourite</span>
												</div>
											</div>
											{quantity > 0 ?
												<div className="flex h-9 shrink-0 items-center rounded-full border border-[#d9d1c1] bg-[#fffaf3] shadow-sm">
													<button
														type="button"
														onClick={() => handleQuantity(product, -1)}
														aria-label={`Remove one ${product.title}`}
														className="flex h-9 w-9 items-center justify-center text-[#173d2d] hover:bg-[#e7f0dc]">
														<Minus className="h-4 w-4" />
													</button>
													<span className="min-w-6 text-center text-sm font-bold">
														{quantity}
													</span>
													<button
														type="button"
														onClick={() => handleQuantity(product, 1)}
														aria-label={`Add one ${product.title}`}
														className="flex h-9 w-9 items-center justify-center text-[#173d2d] hover:bg-[#e7f0dc]">
														<Plus className="h-4 w-4" />
													</button>
												</div>
											:	<button
													type="button"
													onClick={() => handleAdd(product)}
													aria-label={`Add ${product.title} to bag`}
													className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d9d1c1] bg-[#fffaf3] text-[#173d2d] transition-colors hover:border-[#2d6b3f] hover:bg-[#2d6b3f] hover:text-white">
													<Plus className="h-4 w-4" />
												</button>
											}
										</div>
										{product.description && (
											<p className="mt-2 line-clamp-2 text-sm leading-6 text-[#496353]">
												{product.description}
											</p>
										)}
										<p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2d6b3f]">
											<Clock3 className="h-3.5 w-3.5" /> Freshly made
										</p>
									</motion.article>
								);
							})}
						</div>
					}
				</div>
			</section>

			<section className="overflow-hidden bg-[#f3e9d4]">
				<div className="mx-auto grid max-w-[1440px] lg:min-h-[580px] lg:grid-cols-2">
					<div className="relative min-h-[340px] overflow-hidden sm:min-h-[460px] lg:min-h-full">
						<img
							src="/AuthenticFlavors.png"
							alt="A UB Restaurant chef preparing a fresh meal in the kitchen"
							loading="lazy"
							decoding="async"
							className="absolute inset-0 h-full w-full object-cover object-center"
						/>
					</div>
					<div className="flex flex-col justify-center px-6 py-14 sm:px-12 sm:py-20 lg:px-16 xl:px-24">
						<p className="mb-4 text-xs font-bold uppercase tracking-[0.17em] text-[#d7831a]">
							From our kitchen to your table
						</p>
						<h2 className="max-w-xl font-serif text-4xl leading-tight text-[#1b2d26] sm:text-5xl">
							The flavours we love, made for sharing.
						</h2>
						<p className="mt-5 max-w-xl text-base leading-8 text-[#496353]">
							At UB Restaurant, food is more than something to eat. It is the
							warmth of a well-seasoned pot, the joy of an extra piece of
							chicken, and the comfort of a meal that feels familiar from the
							very first bite.
						</p>
						<div className="mt-8 space-y-5">
							{promises.map(({ icon: Icon, title, description }) => (
								<div key={title} className="flex gap-4">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#dfead8] text-[#2d6b3f]">
										<Icon className="h-5 w-5" />
									</div>
									<div>
										<h3 className="text-sm font-bold text-[#1b2d26]">
											{title}
										</h3>
										<p className="mt-1 text-sm leading-6 text-[#496353]">
											{description}
										</p>
									</div>
								</div>
							))}
						</div>
						<Link
							to="/about"
							className="group mt-9 inline-flex w-fit items-center gap-2 rounded-full border border-[#2d6b3f]/40 bg-[#f5ead5] px-4 py-2.5 text-sm font-bold text-[#2d6b3f] transition-colors hover:border-[#2d6b3f] hover:text-[#173d2d]">
							A little more about UB{" "}
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>
				</div>
			</section>

			<section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-16">
				<div className="mx-auto max-w-[1440px]">
					<div className="mb-10 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
						<div>
							<p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#d7831a]">
								A little love from our guests
							</p>
							<h2 className="font-serif text-4xl text-[#1b2d26] sm:text-5xl">
								Don’t just take our word for it.
							</h2>
						</div>
						<div className="flex items-center gap-2 text-sm font-semibold text-[#496353]">
							<span className="flex text-[#f2a524]">
								{Array.from({ length: 5 }, (_, index) => (
									<Star key={index} className="h-4 w-4 fill-current" />
								))}
							</span>{" "}
							Loved around Lagos
						</div>
					</div>
					<div className="grid grid-cols-1 gap-px bg-[#e4dcc8] md:grid-cols-3">
						{reviews.map((review, index) => (
							<motion.figure
								key={review.name}
								initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: shouldReduceMotion ? 0 : 0.4,
									delay: index * 0.08,
								}}
								className="pro-card-soft flex min-h-64 flex-col p-7 sm:p-9">
								<Quote className="h-6 w-6 text-[#d7831a]" />
								<blockquote className="mt-5 flex-1 font-serif text-xl leading-8 text-[#1b2d26]">
									“{review.quote}”
								</blockquote>
								<figcaption className="mt-7 flex items-center justify-between border-t border-[#e4dcc8] pt-4">
									<span className="text-sm font-bold text-[#1b2d26]">
										{review.name}
									</span>
									<span className="text-xs text-[#496353]">{review.area}</span>
								</figcaption>
							</motion.figure>
						))}
					</div>
				</div>
			</section>

			<section className="relative isolate overflow-hidden bg-[#173d2d] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-16">
				<img
					src="/Tasty Oven Grilled Fish Recipe.jpg"
					alt="Spiced grilled fish served fresh from the kitchen"
					loading="lazy"
					decoding="async"
					className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-30"
				/>
				<div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#173d2d] via-[#173d2d]/90 to-[#173d2d]/60" />
				<div className="mx-auto flex max-w-[1440px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
					<div className="max-w-2xl">
						<p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#f2a524]">
							<Check className="h-4 w-4" /> Your next favourite is waiting
						</p>
						<h2 className="font-serif text-4xl leading-tight sm:text-6xl">
							Come hungry.
							<br />
							<span className="italic text-[#f2a524]">Leave happy.</span>
						</h2>
						<p className="mt-4 max-w-lg text-base leading-7 text-white/75">
							Choose something lovely from the menu and let us take care of the
							rest.
						</p>
					</div>
					<Link
						to="/services"
						className="pro-button-primary group w-full sm:w-auto">
						Order something good{" "}
						<ShoppingBag className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>
			</section>
		</main>
	);
};

export default Home;
