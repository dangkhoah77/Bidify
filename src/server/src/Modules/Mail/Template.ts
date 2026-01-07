import assert from 'assert'

import Keys from 'Server/Config/Keys.js'
import { Mail } from 'Shared/Data/Types/index.js'

// --- Common HTML Wrapper ---
const wrapHtml = (content: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Bidify</h1>
            <p style="color: #6b7280; margin: 5px 0;">Nền tảng đấu giá trực tuyến</p>
        </div>
        ${content}
        <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
            <p>© 2024 Bidify. Tất cả quyền được bảo lưu.</p>
        </div>
    </div>
`

/**
 * OTP Email Template for Registration
 */
function registrationOtpEmail(
	otp: string,
	firstName: string,
	lastName: string
): Mail {
	const fullName = `${firstName} ${lastName}`
	return {
		subject: 'Xác thực đăng ký tài khoản - Bidify',
		text: `Chào ${fullName},\n\nMã OTP để hoàn tất đăng ký tài khoản của bạn là: ${otp}\n\nMã này có hiệu lực trong 10 phút.\n\nNếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.`,
		html: wrapHtml(`
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h2 style="color: #1e293b; margin-top: 0;">Xác thực đăng ký tài khoản</h2>
                <p style="color: #475569; font-size: 16px;">Chào ${fullName},</p>
                <p style="color: #475569; font-size: 16px;">Mã OTP để hoàn tất đăng ký tài khoản của bạn là:</p>
                
                <div style="background: white; border: 2px dashed #2563eb; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px;">
                    <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px;">${otp}</span>
                </div>
                
                <p style="color: #ef4444; font-weight: 500; text-align: center;">Mã này có hiệu lực trong 10 phút</p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.</p>
            </div>
        `),
	}
}

/**
 * Reset Password Email Template
 */
function resetPasswordEmail(resetToken: string): Mail {
	const resetUrl = `${Keys.app.clientURL}/reset-password/${resetToken}`

	return {
		subject: 'Đặt lại mật khẩu - Bidify',
		text: `Bạn nhận được email này vì bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n\nVui lòng click vào link sau để hoàn tất quá trình:\n\n${resetUrl}\n\nNếu bạn không yêu cầu thay đổi này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n\nLink này sẽ hết hạn sau 1 giờ.`,
		html: wrapHtml(`
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h2 style="color: #1e293b; margin-top: 0;">Đặt lại mật khẩu</h2>
                <p style="color: #475569; font-size: 16px;">Bạn nhận được email này vì bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block;">Đặt lại mật khẩu</a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px;">Hoặc copy và paste link sau vào trình duyệt:</p>
                <p style="color: #2563eb; word-break: break-all; font-size: 14px;">${resetUrl}</p>
                
                <div style="background: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p style="color: #92400e; margin: 0; font-size: 14px;"><strong>Lưu ý:</strong> Link này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu thay đổi này, vui lòng bỏ qua email này.</p>
                </div>
            </div>
        `),
	}
}

/**
 * Password Reset Confirmation Email Template
 */
function confirmResetPasswordEmail(): Mail {
	return {
		subject: 'Mật khẩu đã được thay đổi - Bidify',
		text: 'Bạn nhận được email này vì mật khẩu tài khoản của bạn vừa được thay đổi.\n\nNếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.',
		html: wrapHtml(`
            <div style="background: #f0f9ff; padding: 30px; border-radius: 8px; border: 1px solid #0ea5e9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="background: #22c55e; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px;">✓</div>
                </div>
                <h2 style="color: #1e293b; text-align: center; margin-top: 0;">Mật khẩu đã được thay đổi</h2>
                <p style="color: #475569; font-size: 16px; text-align: center;">Mật khẩu tài khoản của bạn đã được thay đổi thành công.</p>
                
                <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p style="color: #dc2626; margin: 0; font-size: 14px; text-align: center;"><strong>Quan trọng:</strong> Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
                </div>
            </div>
        `),
	}
}

/**
 * Welcome Email Template after successful registration
 */
function welcomeEmail(firstName: string, lastName: string): Mail {
	const fullName = `${firstName} ${lastName}`
	return {
		subject: 'Chào mừng bạn đến với Bidify!',
		text: `Chào ${fullName}!\n\nChào mừng bạn đến với Bidify - nền tảng đấu giá trực tuyến hàng đầu!\n\nTài khoản của bạn đã được tạo thành công. Bạn có thể bắt đầu tham gia đấu giá ngay bây giờ.\n\nCảm ơn bạn đã tham gia cộng đồng của chúng tôi!`,
		html: wrapHtml(`
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px;">🎉 Chào mừng bạn!</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Chào ${fullName}, chào mừng bạn đến với Bidify!</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px;">
                <h2 style="color: #1e293b; margin-top: 0;">Tài khoản của bạn đã sẵn sàng!</h2>
                <p style="color: #475569; font-size: 16px;">Tài khoản của bạn đã được tạo thành công. Bạn có thể bắt đầu:</p>
                
                <ul style="color: #475569; font-size: 16px;">
                    <li style="margin-bottom: 8px;">🔍 Khám phá các sản phẩm đấu giá</li>
                    <li style="margin-bottom: 8px;">💰 Tham gia đấu giá các sản phẩm yêu thích</li>
                    <li style="margin-bottom: 8px;">❤️ Thêm sản phẩm vào danh sách yêu thích</li>
                    <li style="margin-bottom: 8px;">🏪 Đăng ký trở thành người bán (nếu muốn)</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${Keys.app.clientURL}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block;">Khám phá ngay</a>
                </div>
            </div>
        `),
	}
}

/**
 * New Bid Notification Email for Seller
 */
function newBidNotificationEmail(
	productName: string,
	bidderName: string,
	price: number
): Mail {
	return {
		subject: `🔥 Có bid mới cho "${productName}" - Bidify`,
		text: `Có bid mới cho sản phẩm "${productName}" của bạn!\n\nNgười bid: ${bidderName}\nGiá bid: ${price.toLocaleString('vi-VN')} VND\n\nĐăng nhập để xem chi tiết.`,
		html: wrapHtml(`
            <div style="background: #f0f9ff; padding: 30px; border-radius: 8px; border-left: 4px solid #2563eb;">
                <h2 style="color: #1e293b; margin-top: 0;">🔥 Có bid mới!</h2>
                <p style="color: #475569; font-size: 16px;">Có bid mới cho sản phẩm "<strong>${productName}</strong>" của bạn!</p>
                
                <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span style="color: #6b7280; font-size: 14px;">👤 Người bid:</span>
                        <span style="color: #1e293b; font-weight: 600;">${bidderName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #6b7280; font-size: 14px;">💰 Giá hiện tại:</span>
                        <span style="color: #16a34a; font-size: 20px; font-weight: bold;">${price.toLocaleString('vi-VN')} VND</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${Keys.app.clientURL}/seller/products" style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Xem chi tiết</a>
                </div>
            </div>
        `),
	}
}

/**
 * Bid Placed Confirmation Email for Bidder
 */
function bidPlacedEmail(
	productName: string,
	price: number,
	maxPrice: number
): Mail {
	return {
		subject: `✅ Bid đã được đặt cho "${productName}" - Bidify`,
		text: `Bid của bạn đã được đặt thành công!\n\nSản phẩm: ${productName}\nGiá hiện tại: ${price.toLocaleString('vi-VN')} VND\nGiá tối đa của bạn: ${maxPrice.toLocaleString('vi-VN')} VND\n\nChúng tôi sẽ thông báo nếu có ai bid cao hơn.`,
		html: wrapHtml(`
            <div style="background: #f0fdf4; padding: 30px; border-radius: 8px; border-left: 4px solid #16a34a;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="background: #16a34a; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 15px;">✅</div>
                    <h2 style="color: #1e293b; margin: 0;">Bid đã được đặt thành công!</h2>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
                    <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">📦 ${productName}</h3>
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #6b7280;">💰 Giá hiện tại:</span>
                            <span style="color: #16a34a; font-weight: bold; font-size: 18px;">${price.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">🎯 Giá tối đa của bạn:</span>
                            <span style="color: #2563eb; font-weight: bold;">${maxPrice.toLocaleString('vi-VN')} VND</span>
                        </div>
                    </div>
                </div>
                
                <div style="background: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p style="color: #92400e; margin: 0; font-size: 14px; text-align: center;">
                        <strong>💡 Lưu ý:</strong> Chúng tôi sẽ tự động bid thay bạn nếu có người khác bid cao hơn (trong phạm vi giá tối đa).
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${Keys.app.clientURL}/watchlist" style="background: #16a34a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; margin-right: 10px;">Xem watchlist</a>
                    <a href="${Keys.app.clientURL}/products" style="background: #6b7280; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Tìm sản phẩm khác</a>
                </div>
            </div>
        `),
	}
}

/**
 * Bid Denied Notification Email
 */
function bidDeniedEmail(productName: string): Mail {
	return {
		subject: `⛔ Lượt đặt giá của bạn đã bị từ chối - "${productName}"`,
		text: `Rất tiếc, lượt đặt giá của bạn cho sản phẩm "${productName}" đã bị người bán từ chối.\n\nBạn có thể xem chi tiết sản phẩm và tiếp tục đấu giá các sản phẩm khác.`,
		html: wrapHtml(`
            <div style="background: #fef2f2; padding: 24px; border-radius: 8px; border-left: 4px solid #ef4444;">
                <h2 style="color: #1e293b; margin-top: 0;">Lượt đặt giá đã bị từ chối</h2>
                <p style="color: #475569; font-size: 16px;">Lượt đặt giá của bạn cho sản phẩm "<strong>${productName}</strong>" đã bị người bán từ chối.</p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${Keys.app.clientURL}/products" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Xem sản phẩm khác</a>
                </div>
            </div>
        `),
	}
}

/**
 * Outbid Notification Email
 */
function outbidNotificationEmail(
	productName: string,
	newWinner: string,
	newPrice: number
): Mail {
	return {
		subject: `⚠️ Bạn đã bị outbid cho "${productName}" - Bidify`,
		text: `Bạn không còn là người bid cao nhất cho sản phẩm "${productName}".\n\nNgười bid mới: ${newWinner}\nGiá hiện tại: ${newPrice.toLocaleString('vi-VN')} VND\n\nĐặt bid cao hơn để giành lại vị trí!`,
		html: wrapHtml(`
            <div style="background: #fef2f2; padding: 30px; border-radius: 8px; border-left: 4px solid #ef4444;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="background: #ef4444; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 15px;">⚠️</div>
                    <h2 style="color: #1e293b; margin: 0;">Bạn đã bị outbid!</h2>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
                    <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">📦 ${productName}</h3>
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #6b7280;">👤 Người bid mới:</span>
                            <span style="color: #1e293b; font-weight: bold;">${newWinner}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">💰 Giá hiện tại:</span>
                            <span style="color: #ef4444; font-weight: bold; font-size: 18px;">${newPrice.toLocaleString('vi-VN')} VND</span>
                        </div>
                    </div>
                </div>
                
                <div style="background: #fef3cd; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p style="color: #92400e; margin: 0; font-size: 14px; text-align: center;">
                        <strong>⏰ Hành động nhanh!</strong> Đặt bid cao hơn để giành lại vị trí dẫn đầu!
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${Keys.app.clientURL}/products" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block;">Đặt bid cao hơn</a>
                </div>
            </div>
        `),
	}
}

/**
 * Auction Won Notification Email
 */
function auctionWonEmail(productName: string, finalPrice: number): Mail {
	return {
		subject: `🎉 Chúc mừng! Bạn đã thắng đấu giá "${productName}" - Bidify`,
		text: `Chúc mừng! Bạn đã thắng đấu giá cho sản phẩm "${productName}"!\n\nGiá cuối cùng: ${finalPrice.toLocaleString('vi-VN')} VND\n\nVui lòng đăng nhập để hoàn tất giao dịch và liên hệ với người bán.`,
		html: wrapHtml(`
            <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 40px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <div style="font-size: 60px; margin-bottom: 15px;">🎉</div>
                <h1 style="margin: 0; font-size: 28px;">Chúc mừng!</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Bạn đã thắng đấu giá!</p>
            </div>
            
            <div style="background: #f0fdf4; padding: 30px; border-radius: 8px; border: 1px solid #16a34a;">
                <div style="background: white; padding: 25px; border-radius: 8px; margin: 0 0 25px 0; text-align: center; border: 2px solid #16a34a;">
                    <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px;">📦 ${productName}</h3>
                    <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                        <p style="color: #6b7280; margin: 0 0 5px 0;">Giá thành công</p>
                        <p style="margin: 0; color: #16a34a; font-size: 32px; font-weight: bold;">${finalPrice.toLocaleString('vi-VN')} VND</p>
                    </div>
                </div>
                
                <div style="background: #fef3cd; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📋 Các bước tiếp theo:</h4>
                    <ol style="color: #92400e; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 5px;">Liên hệ với người bán để thống nhất giao hàng</li>
                        <li style="margin-bottom: 5px;">Thanh toán theo thỏa thuận</li>
                        <li style="margin-bottom: 5px;">Nhận hàng và kiểm tra</li>
                        <li style="margin-bottom: 0;">Đánh giá người bán sau khi hoàn tất</li>
                    </ol>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${Keys.app.clientURL}/profile" style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block; margin-right: 10px;">Xem chi tiết giao dịch</a>
                </div>
            </div>
        `),
	}
}

/**
 * Auction Ended (Seller) - With Winner or No Winner
 */
function auctionEndedSellerEmail(
	productName: string,
	finalPrice: number,
	winnerName?: string
): Mail {
	const hasWinner = !!winnerName

	return {
		subject: `🎊 Đấu giá kết thúc: "${productName}" - Bidify`,
		text: hasWinner
			? `Đấu giá cho sản phẩm "${productName}" đã kết thúc thành công!\n\nNgười thắng: ${winnerName}\nGiá cuối: ${finalPrice.toLocaleString('vi-VN')} VND\n\nVui lòng liên hệ với người thắng để hoàn tất giao dịch.`
			: `Đấu giá cho sản phẩm "${productName}" đã kết thúc.\n\nKhông có bid nào được đặt cho sản phẩm này.\n\nBạn có thể đăng lại sản phẩm với giá khởi điểm thấp hơn.`,
		html: wrapHtml(`
            <div style="background: ${hasWinner ? '#f0fdf4' : '#fef3cd'}; padding: 30px; border-radius: 8px; border: 1px solid ${hasWinner ? '#16a34a' : '#fbbf24'};">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">${hasWinner ? '🎊' : '⏰'}</div>
                    <h2 style="color: #1e293b; margin: 0;">Đấu giá đã kết thúc</h2>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
                    <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">📦 ${productName}</h3>
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 15px;">
                        ${
							hasWinner
								? `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: #6b7280;">🏆 Người thắng:</span>
                                <span style="color: #1e293b; font-weight: bold;">${winnerName}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #6b7280;">💰 Giá cuối cùng:</span>
                                <span style="color: #16a34a; font-weight: bold; font-size: 18px;">${finalPrice.toLocaleString('vi-VN')} VND</span>
                            </div>
                        `
								: `
                            <div style="text-align: center; color: #92400e; font-size: 16px;">
                                <p style="margin: 0;">❌ Không có bid nào cho sản phẩm này</p>
                            </div>
                        `
						}
                    </div>
                </div>
                
                ${
					hasWinner
						? `
                    <div style="background: #fef3cd; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📋 Các bước tiếp theo:</h4>
                        <ol style="color: #92400e; margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 5px;">Liên hệ với người thắng để thống nhất giao hàng</li>
                            <li style="margin-bottom: 5px;">Nhận thanh toán theo thỏa thuận</li>
                            <li style="margin-bottom: 5px;">Giao hàng cho người mua</li>
                            <li style="margin-bottom: 0;">Đánh giá người mua sau khi hoàn tất</li>
                        </ol>
                    </div>
                `
						: `
                    <div style="background: #fef2f2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">💡 Gợi ý:</h4>
                        <ul style="color: #dc2626; margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 5px;">Giảm giá khởi điểm để thu hút nhiều bidder hơn</li>
                            <li style="margin-bottom: 5px;">Thêm ảnh chất lượng cao hơn</li>
                            <li style="margin-bottom: 5px;">Viết mô tả chi tiết hơn</li>
                        </ul>
                    </div>
                `
				}
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${Keys.app.clientURL}/seller/products" style="background: ${hasWinner ? '#16a34a' : '#2563eb'}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block;">
                        ${hasWinner ? 'Quản lý giao dịch' : 'Đăng sản phẩm mới'}
                    </a>
                </div>
            </div>
        `),
	}
}

/**
 * Outbid when Auction Ended Email
 */
function outbidAuctionEndedEmail(
	productName: string,
	winnerName: string,
	finalPrice: number
): Mail {
	return {
		subject: `😔 Đấu giá kết thúc - Bạn không thắng "${productName}" - Bidify`,
		text: `Đấu giá cho sản phẩm "${productName}" đã kết thúc.\n\nNgười thắng: ${winnerName}\nGiá cuối cùng: ${finalPrice.toLocaleString('vi-VN')} VND\n\nCảm ơn bạn đã tham gia! Tìm kiếm thêm sản phẩm khác nhé.`,
		html: wrapHtml(`
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px; border-left: 4px solid #6b7280;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">😔</div>
                    <h2 style="color: #1e293b; margin: 0;">Đấu giá đã kết thúc</h2>
                    <p style="color: #6b7280; margin: 10px 0 0;">Rất tiếc, bạn không thắng lần này</p>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
                    <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">📦 ${productName}</h3>
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #6b7280;">🏆 Người thắng:</span>
                            <span style="color: #1e293b; font-weight: bold;">${winnerName}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">💰 Giá cuối cùng:</span>
                            <span style="color: #ef4444; font-weight: bold; font-size: 18px;">${finalPrice.toLocaleString('vi-VN')} VND</span>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${Keys.app.clientURL}/products" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block; margin-right: 10px;">Tìm sản phẩm khác</a>
                </div>
            </div>
        `),
	}
}

/**
 * Auction Ended with No Bids (for Seller)
 */
function auctionEndedNoBidsEmail(productName: string): Mail {
	return {
		subject: `📭 Đấu giá kết thúc - Không có bid cho "${productName}" - Bidify`,
		text: `Đấu giá cho sản phẩm "${productName}" đã kết thúc nhưng không có bid nào.\n\nBạn có thể:\n- Giảm giá khởi điểm\n- Cải thiện mô tả và hình ảnh\n- Đăng lại vào thời điểm khác\n\nĐăng nhập để quản lý sản phẩm.`,
		html: wrapHtml(`
            <div style="background: #fef3cd; padding: 30px; border-radius: 8px; border-left: 4px solid #fbbf24;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">📭</div>
                    <h2 style="color: #1e293b; margin: 0;">Đấu giá kết thúc</h2>
                    <p style="color: #92400e; margin: 10px 0 0;">Không có bid nào cho sản phẩm này</p>
                </div>
                
                <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
                    <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; text-align: center;">📦 ${productName}</h3>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${Keys.app.clientURL}/seller/products" style="background: #fbbf24; color: #92400e; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; display: inline-block;">Chỉnh sửa & đăng lại</a>
                </div>
            </div>
        `),
	}
}

/**
 * New Question Notification for Seller
 */
function newQuestionEmail(
	productName: string,
	customerName: string,
	question: string,
	productLink: string
): Mail {
	return {
		subject: `❓ Có câu hỏi mới về "${productName}" - Bidify`,
		text: `Người dùng ${customerName} đã đặt câu hỏi về sản phẩm "${productName}":\n\n"${question}"\n\nTrả lời ngay: ${productLink}`,
		html: wrapHtml(`
            <div style="background: #f0f9ff; padding: 30px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <h2 style="color: #1e293b; margin-top: 0;">Có câu hỏi mới!</h2>
                <p style="color: #475569; font-size: 16px;"><strong>${customerName}</strong> đã đặt câu hỏi về sản phẩm "<strong>${productName}</strong>".</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; font-style: italic; color: #475569;">
                    "${question}"
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${productLink}" style="background: #0ea5e9; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Trả lời ngay</a>
                </div>
            </div>
        `),
	}
}

/**
 * Seller Replied to Your Question
 */
function sellerRepliedEmail(
	productName: string,
	answer: string,
	productLink: string
): Mail {
	return {
		subject: `💬 Người bán đã trả lời câu hỏi của bạn về "${productName}" - Bidify`,
		text: `Người bán đã trả lời câu hỏi của bạn về sản phẩm "${productName}":\n\n"${answer}"\n\nXem chi tiết: ${productLink}`,
		html: wrapHtml(`
            <div style="background: #f0fdf4; padding: 30px; border-radius: 8px; border-left: 4px solid #16a34a;">
                <h2 style="color: #1e293b; margin-top: 0;">Người bán đã trả lời!</h2>
                <p style="color: #475569; font-size: 16px;">Câu hỏi của bạn về sản phẩm "<strong>${productName}</strong>" đã được trả lời.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; color: #1e293b;">
                    <strong>Trả lời:</strong><br>
                    "${answer}"
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${productLink}" style="background: #16a34a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Xem chi tiết</a>
                </div>
            </div>
        `),
	}
}

/**
 * Seller Upgrade Request Approved
 */
function sellerUpgradeApprovedEmail(firstName: string): Mail {
	return {
		subject: '🎉 Yêu cầu nâng cấp tài khoản Seller đã được duyệt - Bidify',
		text: `Chúc mừng ${firstName}!\n\nYêu cầu nâng cấp lên tài khoản Seller của bạn đã được Admin chấp thuận. Bạn có thể bắt đầu đăng bán sản phẩm ngay bây giờ.\n\nQuyền hạn Seller có hiệu lực trong 7 ngày.`,
		html: wrapHtml(`
            <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; padding: 40px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <div style="font-size: 50px; margin-bottom: 15px;">🏪</div>
                <h1 style="margin: 0; font-size: 24px;">Chúc mừng!</h1>
                <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Bạn đã trở thành Seller!</p>
            </div>
            
            <div style="background: #f8fafc; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="color: #475569; font-size: 16px;">Chào <strong>${firstName}</strong>,</p>
                <p style="color: #475569; font-size: 16px;">Yêu cầu nâng cấp tài khoản của bạn đã được Admin chấp thuận.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                    <h4 style="color: #1e293b; margin-top: 0;">Quyền lợi Seller:</h4>
                    <ul style="color: #475569; margin-bottom: 0;">
                        <li>Đăng sản phẩm đấu giá không giới hạn</li>
                        <li>Quản lý danh sách sản phẩm đang bán</li>
                        <li>Trả lời câu hỏi của người mua</li>
                    </ul>
                    <p style="color: #6366f1; font-weight: bold; margin-top: 15px; font-size: 14px;">Lưu ý: Quyền hạn này có hiệu lực trong 7 ngày.</p>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="${Keys.app.clientURL}/seller/create" style="background: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Đăng sản phẩm ngay</a>
                </div>
            </div>
        `),
	}
}

/**
 * Prepare mail template based on type
 */
export default function (type: string, data: any): Mail | null {
	let message: Mail | null = null

	switch (type) {
		case 'RegistrationOtp':
			assert(data.otp && typeof data.otp === 'string', 'OTP required')
			assert(
				data.firstName && typeof data.firstName === 'string',
				'firstName required'
			)
			assert(
				data.lastName && typeof data.lastName === 'string',
				'lastName required'
			)
			message = registrationOtpEmail(
				data.otp,
				data.firstName,
				data.lastName
			)
			break

		case 'Welcome':
			assert(
				data.firstName && typeof data.firstName === 'string',
				'firstName required'
			)
			assert(
				data.lastName && typeof data.lastName === 'string',
				'lastName required'
			)
			message = welcomeEmail(data.firstName, data.lastName)
			break

		case 'ResetPassword':
			assert(
				data.resetToken && typeof data.resetToken === 'string',
				'resetToken required'
			)
			message = resetPasswordEmail(data.resetToken)
			break

		case 'ResetPasswordConfirmation':
			message = confirmResetPasswordEmail()
			break

		case 'NewBid':
			assert(data.productName, 'productName required')
			assert(data.bidderName, 'bidderName required')
			assert(typeof data.price === 'number', 'price required')
			message = newBidNotificationEmail(
				data.productName,
				data.bidderName,
				data.price
			)
			break

		case 'BidPlaced':
			assert(data.productName, 'productName required')
			assert(typeof data.price === 'number', 'price required')
			assert(typeof data.maxPrice === 'number', 'maxPrice required')
			message = bidPlacedEmail(
				data.productName,
				data.price,
				data.maxPrice
			)
			break

		case 'BidDenied':
			assert(data.productName, 'productName required')
			message = bidDeniedEmail(data.productName)
			break

		case 'Outbid':
			assert(data.productName, 'productName required')
			assert(data.newWinner, 'newWinner required')
			assert(typeof data.newPrice === 'number', 'newPrice required')
			message = outbidNotificationEmail(
				data.productName,
				data.newWinner,
				data.newPrice
			)
			break

		case 'AuctionWon':
			assert(data.productName, 'productName required')
			assert(typeof data.finalPrice === 'number', 'finalPrice required')
			message = auctionWonEmail(data.productName, data.finalPrice)
			break

		case 'AuctionEndedSeller':
			assert(data.productName, 'productName required')
			assert(typeof data.finalPrice === 'number', 'finalPrice required')
			message = auctionEndedSellerEmail(
				data.productName,
				data.finalPrice,
				data.winnerName
			)
			break

		case 'OutbidAuctionEnded':
			assert(data.productName, 'productName required')
			assert(data.winnerName, 'winnerName required')
			assert(typeof data.finalPrice === 'number', 'finalPrice required')
			message = outbidAuctionEndedEmail(
				data.productName,
				data.winnerName,
				data.finalPrice
			)
			break

		case 'AuctionEndedNoBids':
			assert(data.productName, 'productName required')
			message = auctionEndedNoBidsEmail(data.productName)
			break

		case 'NewQuestion':
			assert(data.productName, 'productName required')
			assert(data.customerName, 'customerName required')
			assert(data.question, 'question required')
			assert(data.productLink, 'productLink required')
			message = newQuestionEmail(
				data.productName,
				data.customerName,
				data.question,
				data.productLink
			)
			break

		case 'NewAnswer':
			assert(data.productName, 'productName required')
			assert(data.answer, 'answer required')
			assert(data.productLink, 'productLink required')
			message = sellerRepliedEmail(
				data.productName,
				data.answer,
				data.productLink
			)
			break

		case 'SellerUpgradeApproved':
			assert(data.firstName, 'firstName required')
			message = sellerUpgradeApprovedEmail(data.firstName)
			break

		default:
			console.warn(`Unknown mail type: ${type}`)
	}

	return message
}
