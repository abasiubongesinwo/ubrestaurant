// Small utility to lazy-load background images on elements with `data-bg` attribute
function initLazyBackgrounds() {
	if (typeof window === "undefined" || !("IntersectionObserver" in window))
		return;

	const elements = document.querySelectorAll("[data-bg]");
	if (!elements.length) return;

	const io = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const el = entry.target;
				const src = el.dataset.bg;
				if (src) {
					el.style.backgroundImage = `url("${src}")`;
					el.removeAttribute("data-bg");
				}
				obs.unobserve(el);
			});
		},
		{ rootMargin: "200px" },
	);

	elements.forEach((el) => io.observe(el));
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initLazyBackgrounds);
} else {
	initLazyBackgrounds();
}

export default initLazyBackgrounds;
