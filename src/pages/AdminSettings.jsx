import { useState } from "react";
import {
	User,
	Store,
	MapPin,
	CreditCard,
	Truck,
	Shield,
	Save,
	Clock,
} from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
	const [settings, setSettings] = useState({
		adminName: "Admin",
		adminEmail: "admin@ubrestaurant.com",

		restaurantName: "UB Restaurant",
		restaurantPhone: "+2347000000000",
		restaurantEmail: "info@ubrestaurant.com",
		restaurantAddress: "Uyo, Akwa Ibom",

		openTime: "08:00",
		closeTime: "22:00",

		deliveryFee: 1000,
		freeDeliveryAmount: 30000,

		paystackPublicKey: "",
		paystackSecretKey: "",

		allowCashOnDelivery: true,
		allowOnlinePayment: true,
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		setSettings((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSave = () => {
		// Later call your API here
		toast.success("Settings saved successfully.");
		console.log(settings);
	};

	const Card = ({ title, icon: Icon, children }) => (
		<div className="bg-white rounded-2xl border p-6 shadow-sm">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
					<Icon className="w-5 h-5 text-amber-700" />
				</div>

				<h2 className="font-bold text-lg">{title}</h2>
			</div>

			<div className="space-y-4">{children}</div>
		</div>
	);

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Settings</h1>

			<div className="grid lg:grid-cols-2 gap-6">
				<Card title="Administrator" icon={User}>
					<input
						name="adminName"
						value={settings.adminName}
						onChange={handleChange}
						placeholder="Admin Name"
						className="w-full border rounded-xl px-4 py-3"
					/>

					<input
						name="adminEmail"
						value={settings.adminEmail}
						onChange={handleChange}
						placeholder="Admin Email"
						className="w-full border rounded-xl px-4 py-3"
					/>
				</Card>

				<Card title="Restaurant" icon={Store}>
					<input
						name="restaurantName"
						value={settings.restaurantName}
						onChange={handleChange}
						placeholder="Restaurant Name"
						className="w-full border rounded-xl px-4 py-3"
					/>

					<input
						name="restaurantPhone"
						value={settings.restaurantPhone}
						onChange={handleChange}
						placeholder="Phone Number"
						className="w-full border rounded-xl px-4 py-3"
					/>

					<input
						name="restaurantEmail"
						value={settings.restaurantEmail}
						onChange={handleChange}
						placeholder="Restaurant Email"
						className="w-full border rounded-xl px-4 py-3"
					/>
				</Card>

				<Card title="Restaurant Address" icon={MapPin}>
					<textarea
						name="restaurantAddress"
						value={settings.restaurantAddress}
						onChange={handleChange}
						rows={4}
						className="w-full border rounded-xl px-4 py-3"
					/>
				</Card>

				<Card title="Business Hours" icon={Clock}>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium">Open</label>

							<input
								type="time"
								name="openTime"
								value={settings.openTime}
								onChange={handleChange}
								className="w-full border rounded-xl px-4 py-3"
							/>
						</div>

						<div>
							<label className="text-sm font-medium">Close</label>

							<input
								type="time"
								name="closeTime"
								value={settings.closeTime}
								onChange={handleChange}
								className="w-full border rounded-xl px-4 py-3"
							/>
						</div>
					</div>
				</Card>

				<Card title="Delivery" icon={Truck}>
					<input
						type="number"
						name="deliveryFee"
						value={settings.deliveryFee}
						onChange={handleChange}
						placeholder="Delivery Fee"
						className="w-full border rounded-xl px-4 py-3"
					/>

					<input
						type="number"
						name="freeDeliveryAmount"
						value={settings.freeDeliveryAmount}
						onChange={handleChange}
						placeholder="Free Delivery Threshold"
						className="w-full border rounded-xl px-4 py-3"
					/>
				</Card>

				<Card title="Payment" icon={CreditCard}>
					<input
						name="paystackPublicKey"
						value={settings.paystackPublicKey}
						onChange={handleChange}
						placeholder="Paystack Public Key"
						className="w-full border rounded-xl px-4 py-3"
					/>

					<input
						name="paystackSecretKey"
						type="password"
						value={settings.paystackSecretKey}
						onChange={handleChange}
						placeholder="Paystack Secret Key"
						className="w-full border rounded-xl px-4 py-3"
					/>

					<label className="flex items-center gap-3">
						<input
							type="checkbox"
							name="allowCashOnDelivery"
							checked={settings.allowCashOnDelivery}
							onChange={handleChange}
						/>
						Cash on Delivery
					</label>

					<label className="flex items-center gap-3">
						<input
							type="checkbox"
							name="allowOnlinePayment"
							checked={settings.allowOnlinePayment}
							onChange={handleChange}
						/>
						Online Payment
					</label>
				</Card>

				<Card title="Security" icon={Shield}>
					<input
						type="password"
						placeholder="New Password"
						className="w-full border rounded-xl px-4 py-3"
					/>

					<input
						type="password"
						placeholder="Confirm Password"
						className="w-full border rounded-xl px-4 py-3"
					/>
				</Card>
			</div>

			<div className="flex justify-end">
				<button
					onClick={handleSave}
					className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold">
					<Save className="w-5 h-5" />
					Save Settings
				</button>
			</div>
		</div>
	);
};

export default AdminSettings;
