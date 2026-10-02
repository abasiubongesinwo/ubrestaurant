import { useEffect, useState } from "react";
import { BadgeCheck, CircleAlert, Mail, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";

const AccountProfile = () => {
	const { user, updateProfile } = useAuth();
	const [profile, setProfile] = useState(user || {});
	const [fullName, setFullName] = useState(user?.fullName || "");
	const [phone, setPhone] = useState(user?.phone || user?.phoneNumber || "");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;
		api.getMe()
			.then((currentUser) => {
				if (!active) return;
				setProfile(currentUser);
				setFullName(currentUser.fullName || "");
				setPhone(currentUser.phone || currentUser.phoneNumber || "");
			})
			.catch((loadError) => {
				if (active) setError(loadError.message || "We couldn't load your profile.");
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSaving(true);
		try {
			const updatedUser = await updateProfile({ fullName, phone });
			setProfile(updatedUser);
			toast.success("Your profile has been updated.");
		} catch (saveError) {
			toast.error(saveError.message || "Unable to update your profile.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
			<div className="border-b border-stone-100 px-5 py-5 sm:px-7">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><UserRound className="h-5 w-5" /></div>
					<div><h2 className="text-lg font-bold text-gray-950">Profile details</h2><p className="text-sm text-gray-500">Manage the information used for your account and orders.</p></div>
				</div>
			</div>

			{error && <div role="alert" className="mx-5 mt-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-7"><CircleAlert className="h-4 w-4 shrink-0" />{error}</div>}
			<form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
				<label className="block">
					<span className="mb-1.5 block text-sm font-semibold text-gray-700">Full name</span>
					<span className="relative block"><UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input required maxLength={100} value={fullName} onChange={(event) => setFullName(event.target.value)} disabled={loading || saving} autoComplete="name" className="min-h-11 w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-50" /></span>
				</label>
				<label className="block">
					<span className="mb-1.5 block text-sm font-semibold text-gray-700">Email address</span>
					<span className="relative block"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={profile.email || user?.email || ""} readOnly autoComplete="email" className="min-h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-3 text-sm text-gray-600" /></span>
					<span className="mt-1 block text-xs text-gray-500">Email address is used to identify your account.</span>
				</label>
				<label className="block">
					<span className="mb-1.5 block text-sm font-semibold text-gray-700">Phone number <span className="font-normal text-gray-400">(optional)</span></span>
					<span className="relative block"><Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input type="tel" maxLength={30} value={phone} onChange={(event) => setPhone(event.target.value)} disabled={loading || saving} autoComplete="tel" placeholder="Add a contact number" className="min-h-11 w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-stone-50" /></span>
				</label>

				<div className="rounded-xl bg-stone-50 p-4">
					<p className="text-xs font-bold uppercase tracking-wide text-gray-500">Account information</p>
					<dl className="mt-3 grid gap-3 sm:grid-cols-2">
						<div><dt className="text-xs text-gray-500">Account type</dt><dd className="mt-0.5 text-sm font-semibold capitalize text-gray-800">{profile.role || user?.role || "Customer"}</dd></div>
						<div><dt className="text-xs text-gray-500">Email verification</dt><dd className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800"><BadgeCheck className={`h-4 w-4 ${profile.emailVerified ? "text-emerald-600" : "text-gray-400"}`} />{profile.emailVerified ? "Verified" : "Not verified"}</dd></div>
						{profile.createdAt && <div><dt className="text-xs text-gray-500">Member since</dt><dd className="mt-0.5 text-sm font-semibold text-gray-800">{new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</dd></div>}
					</dl>
				</div>

				<div className="flex justify-end border-t border-stone-100 pt-5">
					<button type="submit" disabled={loading || saving || !fullName.trim()} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button>
				</div>
			</form>
		</section>
	);
};

export default AccountProfile;