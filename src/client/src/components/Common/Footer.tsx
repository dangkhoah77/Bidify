import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

/**
 * Footer Component.
 * Displays the footer with links and contact information.
 */
const Footer: React.FC = () => {
	return (
		<footer className="bg-slate-900 text-slate-200 mt-auto">
			<div className="container py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Brand */}
					<div className="space-y-4">
						<h3 className="text-2xl font-bold text-white">
							AuctionHub
						</h3>
						<p className="text-sm text-slate-400">
							Sàn đấu giá trực tuyến uy tín hàng đầu Việt Nam. Nơi
							kết nối đam mê và sở hữu những món đồ độc đáo.
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								className="hover:text-white transition-colors"
							>
								<Facebook className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="hover:text-white transition-colors"
							>
								<Twitter className="h-5 w-5" />
							</a>
							<a
								href="#"
								className="hover:text-white transition-colors"
							>
								<Instagram className="h-5 w-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="font-semibold text-white mb-4">
							Khám phá
						</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									to="/products"
									className="hover:text-white transition-colors"
								>
									Tất cả sản phẩm
								</Link>
							</li>
							<li>
								<Link
									to="/products?sort=time_asc"
									className="hover:text-white transition-colors"
								>
									Sắp kết thúc
								</Link>
							</li>
							<li>
								<Link
									to="/products?sort=bids_desc"
									className="hover:text-white transition-colors"
								>
									Nổi bật nhất
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h4 className="font-semibold text-white mb-4">
							Hỗ trợ
						</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									to="#"
									className="hover:text-white transition-colors"
								>
									Hướng dẫn đấu giá
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="hover:text-white transition-colors"
								>
									Chính sách bảo mật
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="hover:text-white transition-colors"
								>
									Điều khoản sử dụng
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="hover:text-white transition-colors"
								>
									Câu hỏi thường gặp
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h4 className="font-semibold text-white mb-4">
							Liên hệ
						</h4>
						<ul className="space-y-3 text-sm">
							<li className="flex items-start gap-3">
								<MapPin className="h-5 w-5 text-primary shrink-0" />
								<span>
									123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí
									Minh
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone className="h-5 w-5 text-primary shrink-0" />
								<span>(028) 3835 4409</span>
							</li>
							<li className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-primary shrink-0" />
								<span>support@auctionhub.vn</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
					<p>
						&copy; {new Date().getFullYear()} AuctionHub. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
