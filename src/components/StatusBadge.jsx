import { motion, useReducedMotion } from "framer-motion";

const StatusBadge = ({ status, className = "" }) => {
	const shouldReduceMotion = useReducedMotion();

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
		cancelled: {
			label: "Cancelled",
			color: "bg-rose-100 text-rose-800 border-rose-200 ring-rose-200/50",
			iconColor: "text-rose-600",
		},
	};

	const config = statusConfig[status] || statusConfig.pending;

	return (
		<motion.span
			initial={false}
			whileHover={shouldReduceMotion ? undefined : { y: -1 }}
			transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
			className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ring-1 ring-inset shadow-sm ${config.color} ${className}`}>
			<div
				aria-hidden="true"
				className={`w-2 h-2 rounded-full mr-2 ${config.iconColor}`}
			/>
			{config.label}
		</motion.span>
	);
};

export default StatusBadge;
