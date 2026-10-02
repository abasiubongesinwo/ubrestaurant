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
		<main className="bg-[#faf8f2] text-[#20251e]">
			<section className="relative isolate flex min-h-[min(780px,calc(100svh-4rem))] items-end overflow-hidden bg-[#182019] text-white">
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
						<div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f6c66a] sm:text-sm">
							<span className="h-px w-9 bg-[#f6c66a]" />
							Lagos, Nigeria · Made with heart
						</div>
						<h1 className="max-w-3xl font-serif text-[clamp(3.1rem,8vw,6.8rem)] font-medium leading-[0.98] text-white">
							A taste of home,
							<span className="mt-2 block italic text-[#f6c66a]">
								wherever you are.
							</span>
						</h1>
						<p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
							From smoky party jollof to slow-simmered soups, find the Nigerian
							comfort food you love, freshly made and brought to your door.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link
								to="/services"
								className="group inline-flex min-h-13 items-center justify-center gap-3 bg-[#e0a83e] px-6 py-3 text-sm font-bold text-[#1b211a] transition-colors hover:bg-[#f1bd56]">
								Explore the menu
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Link>
							<a
								href="#favorites"
								className="inline-flex min-h-13 items-center justify-center gap-2 border border-white/50 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
								See what’s cooking
								<ArrowDown className="h-4 w-4" />
							</a>
						</div>
					</motion.div>

					<div className="hidden w-60 border-l border-white/35 pl-6 pb-1 lg:block">
						<div className="flex items-center gap-1 text-[#f6c66a]">
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

			<div className="border-b border-[#dedbd1] bg-[#f3efe4]">
				<div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-[#dedbd1] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-16">
					<div className="flex items-center gap-3 py-5 sm:justify-center">
						<Clock3 className="h-5 w-5 text-[#718253]" />
						<div>
							<p className="text-sm font-bold">Freshly prepared</p>
							<p className="text-xs text-[#686b60]">Made when you order</p>
						</div>
					</div>
					<div className="flex items-center gap-3 py-5 sm:justify-center sm:px-4">
						<Truck className="h-5 w-5 text-[#718253]" />
						<div>
							<p className="text-sm font-bold">Fast Lagos delivery</p>
							<p className="text-xs text-[#686b60]">
								Packed hot, sent with care
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3 py-5 sm:justify-center">
						<ShieldCheck className="h-5 w-5 text-[#718253]" />
						<div>
							<p className="text-sm font-bold">Secure checkout</p>
							<p className="text-xs text-[#686b60]">
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
							<p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#9b722d]">
								<Flame className="h-4 w-4" /> Straight from our kitchen
							</p>
							<h2 className="font-serif text-4xl leading-tight text-[#20251e] sm:text-5xl">
								The ones everyone comes back for.
							</h2>
							<p className="mt-4 max-w-xl text-base leading-7 text-[#6c6d63]">
								A few house favourites to get you started. Big flavour, made
								fresh, and ready for your table.
							</p>
						</div>
						<Link
							to="/services"
							className="group inline-flex items-center gap-2 self-start border-b border-[#9b722d] pb-1 text-sm font-bold text-[#735321] transition-colors hover:text-[#20251e] sm:self-auto">
							Browse the full menu{" "}
							<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
						</Link>
					</div>

					{loading ?
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
							{Array.from({ length: 4 }, (_, index) => (
								<div
									key={index}
									className="aspect-[0.82] animate-pulse bg-[#eeeadf]"
								/>
							))}
						</div>
					: error ?
						<div className="border border-[#dedbd1] bg-white px-6 py-12 text-center">
							<p className="font-serif text-2xl">
								Our menu is taking a breather.
							</p>
							<p className="mt-2 text-sm text-[#6c6d63]">
								Please visit the full menu to try again.
							</p>
							<Link
								to="/services"
								className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#735321]">
								Open menu <ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					: products.length === 0 ?
						<div className="border border-[#dedbd1] bg-white px-6 py-12 text-center">
							<p className="font-serif text-2xl">
								Something lovely is on the way.
							</p>
							<p className="mt-2 text-sm text-[#6c6d63]">
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
										className="group min-w-0">
										<div className="relative aspect-[0.88] overflow-hidden bg-[#e8e4d9]">
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
												<span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-[#f3efe4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#69491d]">
													<Flame className="h-3 w-3" /> Crowd favourite
												</span>
											)}
											<span className="absolute bottom-3 right-3 bg-[#f3efe4] px-3 py-1.5 text-xs font-bold text-[#20251e]">
												{formatCurrency(product.price)}
											</span>
										</div>
										<div className="flex items-start justify-between gap-3 pt-4">
											<div className="min-w-0">
												<h3 className="truncate font-serif text-xl text-[#20251e]">
													{product.title}
												</h3>
												<div className="mt-1 flex items-center gap-1.5 text-xs text-[#74756c]">
													<span className="flex text-[#bd8a34]">
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
												<div className="flex h-9 shrink-0 items-center border border-[#d7d2c5] bg-white">
													<button
														type="button"
														onClick={() => handleQuantity(product, -1)}
														aria-label={`Remove one ${product.title}`}
														className="flex h-9 w-9 items-center justify-center text-[#4d5744] hover:bg-[#f1efe8]">
														<Minus className="h-4 w-4" />
													</button>
													<span className="min-w-6 text-center text-sm font-bold">
														{quantity}
													</span>
													<button
														type="button"
														onClick={() => handleQuantity(product, 1)}
														aria-label={`Add one ${product.title}`}
														className="flex h-9 w-9 items-center justify-center text-[#4d5744] hover:bg-[#f1efe8]">
														<Plus className="h-4 w-4" />
													</button>
												</div>
											:	<button
													type="button"
													onClick={() => handleAdd(product)}
													aria-label={`Add ${product.title} to bag`}
													className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d7d2c5] bg-white text-[#35442f] transition-colors hover:border-[#35442f] hover:bg-[#35442f] hover:text-white">
													<Plus className="h-4 w-4" />
												</button>
											}
										</div>
										{product.description && (
											<p className="mt-2 line-clamp-2 text-sm leading-6 text-[#74756c]">
												{product.description}
											</p>
										)}
										<p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#718253]">
											<Clock3 className="h-3.5 w-3.5" /> Freshly made
										</p>
									</motion.article>
								);
							})}
						</div>
					}
				</div>
			</section>

			<section className="overflow-hidden bg-[#e9e5d8]">
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
						<p className="mb-4 text-xs font-bold uppercase tracking-[0.17em] text-[#8c672c]">
							From our kitchen to your table
						</p>
						<h2 className="max-w-xl font-serif text-4xl leading-tight text-[#20251e] sm:text-5xl">
							The flavours we love, made for sharing.
						</h2>
						<p className="mt-5 max-w-xl text-base leading-8 text-[#60645a]">
							At UB Restaurant, food is more than something to eat. It is the
							warmth of a well-seasoned pot, the joy of an extra piece of
							chicken, and the comfort of a meal that feels familiar from the
							very first bite.
						</p>
						<div className="mt-8 space-y-5">
							{promises.map(({ icon: Icon, title, description }) => (
								<div key={title} className="flex gap-4">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#d9deca] text-[#43543c]">
										<Icon className="h-5 w-5" />
									</div>
									<div>
										<h3 className="text-sm font-bold text-[#20251e]">
											{title}
										</h3>
										<p className="mt-1 text-sm leading-6 text-[#686b60]">
											{description}
										</p>
									</div>
								</div>
							))}
						</div>
						<Link
							to="/about"
							className="group mt-9 inline-flex w-fit items-center gap-2 border-b border-[#8c672c] pb-1 text-sm font-bold text-[#735321] hover:text-[#20251e]">
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
							<p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#9b722d]">
								A little love from our guests
							</p>
							<h2 className="font-serif text-4xl text-[#20251e] sm:text-5xl">
								Don’t just take our word for it.
							</h2>
						</div>
						<div className="flex items-center gap-2 text-sm font-semibold text-[#5e6258]">
							<span className="flex text-[#bd8a34]">
								{Array.from({ length: 5 }, (_, index) => (
									<Star key={index} className="h-4 w-4 fill-current" />
								))}
							</span>{" "}
							Loved around Lagos
						</div>
					</div>
					<div className="grid grid-cols-1 gap-px bg-[#dedbd1] md:grid-cols-3">
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
								className="flex min-h-64 flex-col bg-[#faf8f2] p-7 sm:p-9">
								<Quote className="h-6 w-6 text-[#b48b4c]" />
								<blockquote className="mt-5 flex-1 font-serif text-xl leading-8 text-[#34382f]">
									“{review.quote}”
								</blockquote>
								<figcaption className="mt-7 flex items-center justify-between border-t border-[#e4e0d6] pt-4">
									<span className="text-sm font-bold text-[#20251e]">
										{review.name}
									</span>
									<span className="text-xs text-[#77796f]">{review.area}</span>
								</figcaption>
							</motion.figure>
						))}
					</div>
				</div>
			</section>

			<section className="relative isolate overflow-hidden bg-[#28362b] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-16">
				<img
					src="/Tasty Oven Grilled Fish Recipe.jpg"
					alt="Spiced grilled fish served fresh from the kitchen"
					loading="lazy"
					decoding="async"
					className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-30"
				/>
				<div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1c2b20] via-[#1c2b20]/90 to-[#1c2b20]/55" />
				<div className="mx-auto flex max-w-[1440px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
					<div className="max-w-2xl">
						<p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#e9c477]">
							<Check className="h-4 w-4" /> Your next favourite is waiting
						</p>
						<h2 className="font-serif text-4xl leading-tight sm:text-6xl">
							Come hungry.
							<br />
							<span className="italic text-[#e9c477]">Leave happy.</span>
						</h2>
						<p className="mt-4 max-w-lg text-base leading-7 text-white/75">
							Choose something lovely from the menu and let us take care of the
							rest.
						</p>
					</div>
					<Link
						to="/services"
						className="group inline-flex min-h-13 w-full items-center justify-center gap-3 bg-[#e0a83e] px-6 py-3 text-sm font-bold text-[#1b211a] transition-colors hover:bg-[#f1bd56] sm:w-auto">
						Order something good{" "}
						<ShoppingBag className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>
			</section>
		</main>
	);
};

export default Home;
