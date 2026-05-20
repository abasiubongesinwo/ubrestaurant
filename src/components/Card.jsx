import { motion } from "framer-motion";

const Card = ({ children, className = "", hoverEffect = true, ...props }) => {
	return (
		<motion.div
			className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 ${className}`}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			whileHover={
				hoverEffect ? { y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } : {}
			}
			viewport={{ once: true }}
			{...props}>
			{children}
		</motion.div>
	);
};

export default Card;
