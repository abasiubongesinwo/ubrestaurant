import { useState } from "react";
import { Users, Search, UserX, Loader2, Trash2, UserMinus } from "lucide-react";

const UserManagementTab = ({
	customers,
	customersLoading,
	isSuperAdmin,
	roleUpdatingId,
	deletingId,
	onToggleRole,
	onDeleteUser,
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredCustomers = customers.filter(
		(cust) =>
			cust.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			cust.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			cust.role?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="space-y-6">
			{/* Tab Controls Bar */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
				<div className="flex items-center gap-3">
					<div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
						<Users className="w-5 h-5" />
					</div>
					<div>
						<h3 className="text-lg font-bold text-gray-900">
							System Users Accounts
						</h3>
						<p className="text-xs text-gray-500">
							{isSuperAdmin ?
								"Full operational editing and management privileges active."
							:	"Viewing user system roster (Modification actions disabled)."}
						</p>
					</div>
				</div>

				<div className="relative max-w-xs w-full">
					<Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						placeholder="Search name, email or role..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
					/>
				</div>
			</div>

			{/* List Body */}
			<div className="space-y-3">
				{customersLoading ?
					<div className="flex justify-center py-20 bg-white rounded-3xl border border-gray-100">
						<Loader2 className="w-8 h-8 animate-spin text-amber-700" />
					</div>
				: filteredCustomers.length === 0 ?
					<div className="text-center py-16 bg-white rounded-3xl border border-gray-100 text-gray-500 flex flex-col items-center gap-2">
						<UserX className="w-8 h-8 text-gray-300" />
						No accounts match your filter selection.
					</div>
				:	filteredCustomers.map((account) => (
						<div
							key={account._id}
							className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-200 transition-all">
							<div className="min-w-0">
								<div className="flex items-center gap-2.5">
									<p className="font-bold text-gray-900 text-base">
										{account.fullName}
									</p>
									<span
										className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
											account.role === "superadmin" ?
												"bg-purple-100 text-purple-800"
											: account.role === "admin" ? "bg-amber-100 text-amber-800"
											: "bg-gray-100 text-gray-600"
										}`}>
										{account.role}
									</span>
								</div>
								<p className="text-xs text-gray-500 mt-0.5 font-mono">
									{account.email}
								</p>
							</div>

							<div className="flex items-center gap-2 self-end sm:self-center">
								{account.role === "superadmin" ?
									<span className="text-xs text-purple-700 font-medium bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
										System Root Owner
									</span>
								: isSuperAdmin ?
									<>
										<button
											disabled={roleUpdatingId === account._id}
											onClick={() => onToggleRole(account._id, account.role)}
											className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
												account.role === "admin" ?
													"bg-red-50 text-red-700 hover:bg-red-100/70 border border-red-100"
												:	"bg-amber-700 text-white hover:bg-amber-800"
											}`}>
											{roleUpdatingId === account._id ?
												<Loader2 className="w-3.5 h-3.5 animate-spin" />
											: account.role === "admin" ?
												<>Revoke Admin</>
											:	<>Grant Admin</>}
										</button>

										<button
											disabled={deletingId === account._id}
											onClick={() => onDeleteUser(account._id)}
											className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
											{deletingId === account._id ?
												<Loader2 className="w-4 h-4 animate-spin text-red-600" />
											:	<Trash2 className="w-4 h-4" />}
										</button>
									</>
								:	<span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1">
										<UserMinus className="w-3.5 h-3.5" /> Actions Locked
									</span>
								}
							</div>
						</div>
					))
				}
			</div>
		</div>
	);
};

export default UserManagementTab;
