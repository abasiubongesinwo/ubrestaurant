import { motion } from "framer-motion";

const Section = ({ id, className = "", children }) => {
	return (
		<motion.section
			id={id}
			className={`py-24 md:py-32 ${className}`}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.3 }}
			transition={{ staggerChildren: 0.2 }}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
		</motion.section>
	);
};

export default Section;
