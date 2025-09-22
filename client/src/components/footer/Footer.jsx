import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa'

export default function Footer() {
	const year = new Date().getFullYear()

	const socials = [
		{ name: 'Facebook', href: '#', icon: <FaFacebookF size={16} /> },
		{ name: 'Instagram', href: '#', icon: <FaInstagram size={16} /> },
		{ name: 'Twitter (X)', href: '#', icon: <FaTwitter size={16} /> },
		{ name: 'LinkedIn', href: '#', icon: <FaLinkedinIn size={16} /> },
	]

			return (
				<footer className="bg-blue-700 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
					{/* Brand */}
					<div>
						<Link to="/" className="inline-flex items-center gap-2">
								<span className="text-2xl font-extrabold text-white">MediCare</span>
							<span className="text-green-500 text-xl font-bold">+</span>
						</Link>
							<p className="mt-4 text-blue-100">
							Your trusted online pharmacy for medicines and health products, delivered fast.
						</p>

						{/* Socials */}
						<div className="mt-6">
								<p className="text-sm font-semibold text-white tracking-wide uppercase">Follow us</p>
								<div className="mt-3 flex items-center gap-3">
								{socials.map(({ name, href, icon }) => (
									<a
										key={name}
										href={href}
										target="_blank"
										rel="noreferrer"
										aria-label={name}
																className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/50 text-blue-100 hover:text-white hover:border-white transition-colors"
									>
										{icon}
									</a>
								))}
							</div>
						</div>
					</div>

					{/* Quick links */}
					<nav aria-label="Quick links">
							<h3 className="text-sm font-semibold text-white tracking-wide uppercase">Quick Links</h3>
						<ul className="mt-4 space-y-3">
								<li><Link to="/" className="text-blue-100 hover:text-white">Home</Link></li>
								<li><Link to="/medicines" className="text-blue-100 hover:text-white">Medicines</Link></li>
								<li><Link to="/health-products" className="text-blue-100 hover:text-white">Health Products</Link></li>
								<li><Link to="/prescriptions" className="text-blue-100 hover:text-white">Prescriptions</Link></li>
						</ul>
					</nav>

					{/* Support */}
					<div>
							<h3 className="text-sm font-semibold text-white tracking-wide uppercase">Support</h3>
						<ul className="mt-4 space-y-3">
								<li><a href="#" className="text-blue-100 hover:text-white">Help Center</a></li>
								<li><a href="#" className="text-blue-100 hover:text-white">Shipping & Delivery</a></li>
								<li><a href="#" className="text-blue-100 hover:text-white">Returns & Refunds</a></li>
								<li><a href="#" className="text-blue-100 hover:text-white">Contact Us</a></li>
						</ul>
					</div>

					{/* Newsletter */}
					<div>
							<h3 className="text-sm font-semibold text-white tracking-wide uppercase">Stay Updated</h3>
							<p className="mt-4 text-blue-100">Subscribe for offers and health tips.</p>
							<form className="mt-4 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
							<input
								type="email"
								placeholder="Email address"
									className="w-full rounded-lg border border-transparent bg-white text-gray-900 placeholder-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
							/>
							<button
								type="submit"
									className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
							>
								Subscribe
							</button>
						</form>
							<p className="mt-2 text-xs text-blue-100">We respect your privacy.</p>
					</div>
				</div>
			</div>

						<div className="border-t border-blue-600/40">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-sm text-blue-100">© {year} MediCare. All rights reserved.</p>
						<div className="flex items-center gap-6 text-sm text-blue-100">
							<a href="#" className="hover:text-white">Privacy</a>
							<a href="#" className="hover:text-white">Terms</a>
							<a href="#" className="hover:text-white">Cookies</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

