// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import Button from '../components/Button';
// import { toast } from 'sonner';
// import { Shield, Mail, Lock, ArrowLeft } from 'lucide-react';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // Mock login
//     await new Promise(r => setTimeout(r, 1500));
//     if (email === 'admin@ubrestaurant.com' && password === 'admin123') {
//       localStorage.setItem('ubrestaurant-admin', 'true');
//       toast.success('Welcome back, Admin!');
//       navigate('/admin/dashboard');
//     } else {
//       toast.error('Invalid credentials');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 flex items-center justify-center p-4 py-20">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="w-full max-w-md"
//       >
//         <div className="text-center mb-12">
//           <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
//             <Shield className="w-12 h-12 text-white" />
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
//             Admin Login
//           </h1>
//           <p className="text-xl text-gray-600">Sign in to your dashboard</p>
//         </div>

//         <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-10">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all text-lg placeholder-gray-500"
//                   placeholder="admin@ubrestaurant.com"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all text-lg placeholder-gray-500"
//                   placeholder="admin123"
//                   required
//                 />
//               </div>
//             </div>

//             <Button
//               type="submit"
//               size="lg"
//               variant="primary"
//               className="w-full text-xl py-5"
//               loading={loading}
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </Button>
//           </form>

//           <div className="mt-8 pt-8 border-t border-gray-200 text-center">
//             <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//               Back to Home
//             </Link>
//           </div>

//           <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
//             <p>Demo: <strong>admin@ubrestaurant.com</strong> / <strong>admin123</strong></p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AdminLogin;
