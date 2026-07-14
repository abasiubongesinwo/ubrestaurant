import { motion } from "framer-motion";

const StatusBadge = ({ status, className = "" }) => {
	const statusConfig = {
		pending: {
			label: "Pending",
			color: "bg-amber-100 text-amber-800 border-amber-200 ring-amber-200/50",
			iconColor: "text-amber-600",
		},
		preparing: {
			label: "Preparing",
			color: "bg-blue-100 text-blue-800 border-blue-200 ring-blue-200/50",
			iconColor: "text-blue-600",
		},
		completed: {
			label: "Completed",
			color:
				"bg-emerald-100 text-emerald-800 border-emerald-200 ring-emerald-200/50",
			iconColor: "text-emerald-600",
		},
	};

	const config = statusConfig[status] || statusConfig.pending;

	return (
		<motion.span
			whileHover={{ scale: 1.05 }}
			className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ring-1 ring-inset shadow-sm ${config.color} ${className}`}>
			<div
				className={`w-2 h-2 rounded-full mr-2 animate-pulse ${config.iconColor}`}
			/>
			{config.label}
		</motion.span>
	);
};

export default StatusBadge;
