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
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
	return (
		<div className="flex min-h-screen bg-gray-100">
			<AdminSidebar />
			<main className="flex-1 p-6 md:p-10">
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
