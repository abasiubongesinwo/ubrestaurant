import { useEffect, useMemo, useState } from "react";
import {
	Clock,
	CreditCard,
	MapPin,
	Save,
	Shield,
	Store,
	Truck,
	User,
} from "lucide-react";
import { toast } from "sonner";
import api from "../api";

const AdminSettings = () => {
	const defaultSettings = useMemo(
		() => ({
			restaurantName: "",
			restaurantPhone: "",
			restaurantEmail: "",
			restaurantAddress: "",
			logo: "",
			banner: "",
			openingHours: { open: "08:00", close: "22:00" },
			delivery: { fee: 0, freeDeliveryAmount: 0 },
			payment: {
				allowCashOnDelivery: true,
				allowOnlinePayment: true,
				paystackPublicKey: "",
			},
			socialLinks: { facebook: "", instagram: "", twitter: "", whatsapp: "" },
		}),
		[],
	);

	const [settings, setSettings] = useState(defaultSettings);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	// Load current settings
	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setLoading(true);
				const res = await fetchSettingsFallback();
				if (cancelled) return;

				if (!res?.success)
					throw new Error(res?.message || "Failed to load settings");

				const data = res.data ?? res;

				setSettings({
					...defaultSettings,
					...data,
					openingHours: {
						...defaultSettings.openingHours,
						...(data.openingHours || {}),
					},
					delivery: {
						...defaultSettings.delivery,
						...(data.delivery || {}),
					},
					payment: {
						...defaultSettings.payment,
						...(data.payment || {}),
					},
					socialLinks: {
						...defaultSettings.socialLinks,
						...(data.socialLinks || {}),
					},
				});
			} catch (err) {
				if (!cancelled) {
					toast.error(err?.message || "Failed to load settings");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchSettingsFallback = async () => {
		// GET /api/settings is public; no JWT required.
		const API_BASE =
			import.meta.env.VITE_API_URL ||
			import.meta.env.VITE_API_URL_LOCAL ||
			"https://ubrestaurant-backend.onrender.com";
		const url = `${API_BASE}/api/settings`;

		const resp = await fetch(url, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		const body = await resp.json().catch(() => ({}));

		if (!resp.ok)
			throw new Error(
				body?.message || `GET /api/settings failed (${resp.status})`,
			);

		return body;
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		// name encoding:
		// - "restaurantName" => top-level
		// - "openingHours.open" => nested
		// - "delivery.fee" => nested
		// - "payment.allowCashOnDelivery" => nested
		// - "socialLinks.facebook" => nested
		const parts = name.split(".");
		if (parts.length === 1) {
			setSettings((prev) => ({
				...prev,
				[name]: type === "checkbox" ? checked : value,
			}));
			return;
		}

		const [root, ...rest] = parts;
		const key = rest.join(".");
		setSettings((prev) => ({
			...prev,
			[root]: {
				...(prev[root] || {}),
				[key]: type === "checkbox" ? checked : value,
			},
		}));
	};

	const handleNumericChange = (path, e) => {
		const value = e.target.value;
		const num = value === "" ? "" : Number(value);

		const parts = path.split(".");
		if (parts.length === 1) {
			setSettings((prev) => ({ ...prev, [path]: num }));
			return;
		}
		const [root, ...rest] = parts;
		const key = rest.join(".");
		setSettings((prev) => ({
			...prev,
			[root]: {
				...(prev[root] || {}),
				[key]: num,
			},
		}));
	};

	const handleSave = async () => {
		try {
			setSaving(true);

			const payload = {
				restaurantName: settings.restaurantName,
				restaurantPhone: settings.restaurantPhone,
				restaurantEmail: settings.restaurantEmail,
				restaurantAddress: settings.restaurantAddress,
				logo: settings.logo,
				banner: settings.banner,
				openingHours: {
					open: settings.openingHours?.open,
					close: settings.openingHours?.close,
				},
				delivery: {
					fee: Number(settings.delivery?.fee ?? 0),
					freeDeliveryAmount: Number(
						settings.delivery?.freeDeliveryAmount ?? 0,
					),
				},
				payment: {
					allowCashOnDelivery: !!settings.payment?.allowCashOnDelivery,
					allowOnlinePayment: !!settings.payment?.allowOnlinePayment,
					paystackPublicKey: settings.payment?.paystackPublicKey ?? "",
				},
				socialLinks: {
					facebook: settings.socialLinks?.facebook ?? "",
					instagram: settings.socialLinks?.instagram ?? "",
					twitter: settings.socialLinks?.twitter ?? "",
					whatsapp: settings.socialLinks?.whatsapp ?? "",
				},
			};

			// PUT /api/settings (admin JWT required).
			// Prefer existing apiCall pattern; if not available from api module, use fetch with token from localStorage.
			const token = localStorage.getItem("token");
			if (!token)
				throw new Error("Admin token missing. Please login as admin again.");

			const API_BASE =
				import.meta.env.VITE_API_URL ||
				import.meta.env.VITE_API_URL_LOCAL ||
				"https://ubrestaurant-backend.onrender.com";

			const url = `${API_BASE}/api/settings`;
			const resp = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			const body = await resp.json().catch(() => ({}));
			if (!resp.ok)
				throw new Error(
					body?.message || `PUT /api/settings failed (${resp.status})`,
				);

			toast.success("Settings saved successfully.");
		} catch (err) {
			toast.error(err?.message || "Failed to save settings");
		} finally {
			setSaving(false);
		}
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

	if (loading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="animate-spin rounded-full h-14 w-14 border-4 border-amber-200 border-t-amber-600" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Settings</h1>

			<div className="grid lg:grid-cols-2 gap-6">
				<Card title="Administrator" icon={User}>
					<p className="text-sm text-gray-600">
						Administrator fields are managed by the auth system.
					</p>
				</Card>

				<Card title="Restaurant" icon={Store}>
					<input
						name="restaurantName"
						value={settings.restaurantName ?? ""}
						onChange={handleChange}
						placeholder="Restaurant Name"
						className="w-full border rounded-xl px-4 py-3"
					/>
					<input
						name="restaurantPhone"
						value={settings.restaurantPhone ?? ""}
						onChange={handleChange}
						placeholder="Phone Number"
						className="w-full border rounded-xl px-4 py-3"
					/>
					<input
						name="restaurantEmail"
						value={settings.restaurantEmail ?? ""}
						onChange={handleChange}
						placeholder="Restaurant Email"
						className="w-full border rounded-xl px-4 py-3"
					/>
				</Card>

				<Card title="Restaurant Address" icon={MapPin}>
					<textarea
						name="restaurantAddress"
						value={settings.restaurantAddress ?? ""}
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
								name="openingHours.open"
								value={settings.openingHours?.open ?? "08:00"}
								onChange={handleChange}
								className="w-full border rounded-xl px-4 py-3"
							/>
						</div>
						<div>
							<label className="text-sm font-medium">Close</label>
							<input
								type="time"
								name="openingHours.close"
								value={settings.openingHours?.close ?? "22:00"}
								onChange={handleChange}
								className="w-full border rounded-xl px-4 py-3"
							/>
						</div>
					</div>
				</Card>

				<Card title="Delivery" icon={Truck}>
					<input
						type="number"
						name="delivery.fee"
						value={settings.delivery?.fee ?? 0}
						onChange={(e) => handleNumericChange("delivery.fee", e)}
						placeholder="Delivery Fee"
						className="w-full border rounded-xl px-4 py-3"
					/>
					<input
						type="number"
						name="delivery.freeDeliveryAmount"
						value={settings.delivery?.freeDeliveryAmount ?? 0}
						onChange={(e) =>
							handleNumericChange("delivery.freeDeliveryAmount", e)
						}
						placeholder="Free Delivery Threshold"
						className="w-full border rounded-xl px-4 py-3"
					/>
				</Card>

				<Card title="Payment" icon={CreditCard}>
					<input
						name="payment.paystackPublicKey"
						value={settings.payment?.paystackPublicKey ?? ""}
						onChange={handleChange}
						placeholder="Paystack Public Key"
						className="w-full border rounded-xl px-4 py-3"
					/>

					<label className="flex items-center gap-3">
						<input
							type="checkbox"
							name="payment.allowCashOnDelivery"
							checked={!!settings.payment?.allowCashOnDelivery}
							onChange={handleChange}
						/>
						Cash on Delivery
					</label>

					<label className="flex items-center gap-3">
						<input
							type="checkbox"
							name="payment.allowOnlinePayment"
							checked={!!settings.payment?.allowOnlinePayment}
							onChange={handleChange}
						/>
						Online Payment
					</label>
				</Card>

				<Card title="Security" icon={Shield}>
					<p className="text-sm text-gray-600">
						Password changes are not part of restaurant settings in this
						backend.
					</p>
				</Card>
			</div>

			<div className="flex justify-end">
				<button
					onClick={handleSave}
					disabled={saving}
					className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold">
					<Save className="w-5 h-5" />
					{saving ? "Saving..." : "Save Settings"}
				</button>
			</div>
		</div>
	);
};

export default AdminSettings;
