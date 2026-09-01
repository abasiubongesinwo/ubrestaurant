import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { formatCurrency } from "./utils";

const CartItem = ({ id, name, title, price, image, quantity }) => {
	const { updateQuantity, removeItem } = useCart();

	const itemName = title || name || "Menu Item";
	const itemPrice = Number(price) || 0;
	const itemQuantity = Number(quantity) || 1;
	const total = itemPrice * itemQuantity;

	const decreaseQuantity = () => {
		if (itemQuantity > 1) {
			updateQuantity(id, itemQuantity - 1);
		}
	};

	const increaseQuantity = () => {
		updateQuantity(id, itemQuantity + 1);
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-5">
			{/* Product Information */}
			<div className="flex items-start gap-4">
				{/* Product Image */}
				<div className="shrink-0">
					<img
						src={image}
						alt={itemName}
						loading="lazy"
						decoding="async"
						className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-gray-100"
					/>
				</div>

				{/* Product Details */}
				<div className="flex-1 min-w-0">
					<h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">
						{itemName}
					</h3>

					<p className="text-sm text-gray-500 mt-1">
						{formatCurrency(itemPrice)} each
					</p>

					<p className="text-lg sm:text-xl font-bold text-amber-600 mt-2">
						{formatCurrency(total)}
					</p>
				</div>
			</div>

			{/* Quantity Controls */}
			<div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
				<div className="text-sm text-gray-500">Quantity</div>

				<div className="flex items-center gap-2">
					{/* Decrease */}
					<button
						type="button"
						onClick={decreaseQuantity}
						disabled={itemQuantity <= 1}
						aria-label={`Decrease ${itemName} quantity`}
						className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed">
						<Minus className="w-4 h-4" />
					</button>

					{/* Quantity */}
					<div className="min-w-[48px] h-10 sm:h-11 px-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
						<span className="font-bold text-gray-900">{itemQuantity}</span>
					</div>

					{/* Increase */}
					<button
						type="button"
						onClick={increaseQuantity}
						aria-label={`Increase ${itemName} quantity`}
						className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 active:scale-95 transition">
						<Plus className="w-4 h-4" />
					</button>

					{/* Remove */}
					<button
						type="button"
						onClick={() => removeItem(id)}
						aria-label={`Remove ${itemName} from cart`}
						className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-red-100 bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 active:scale-95 transition ml-1">
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default CartItem;
