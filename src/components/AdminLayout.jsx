// import { Outlet } from 'react-router-dom';
// import AdminSidebar from './AdminSidebar';
// import { motion } from 'framer-motion';

// const AdminLayout = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <AdminSidebar />
//       <main className="flex-1 p-8 lg:p-12 overflow-auto">
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="max-w-7xl mx-auto"
//         >
//           <Outlet />
//         </motion.div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;

import { Outlet } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, LogOut } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

const AdminLayout = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen bg-[#f6f6f3] text-stone-900">
			<AdminSidebar />
			<div className="min-w-0 flex-1">
				<header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white/95 pl-[68px] pr-4 backdrop-blur sm:px-6 sm:pl-[68px] lg:px-8">
					<div className="min-w-0">
						<p className="text-xs font-semibold text-stone-500">UB Restaurant <span className="px-1 text-stone-300">/</span> Operations</p>
						<p className="hidden truncate text-sm font-bold text-stone-900 sm:block">Management workspace</p>
					</div>
					<div className="flex shrink-0 items-center gap-2 sm:gap-3">
						<Link to="/" className="hidden h-9 items-center gap-2 rounded-lg border border-stone-200 px-3 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 sm:inline-flex"><ExternalLink className="h-3.5 w-3.5" />Storefront</Link>
						<div className="hidden text-right sm:block"><p className="max-w-44 truncate text-xs font-bold text-stone-900">{user?.fullName || "Administrator"}</p><p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">{user?.role}</p></div>
						<button type="button" onClick={() => { logout(); navigate("/"); }} aria-label="Log out" title="Log out" className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"><LogOut className="h-4 w-4" /></button>
					</div>
				</header>
				<main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
