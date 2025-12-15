import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { User, Clock } from 'lucide-react'

import type { BidType } from 'Shared/Data/Types/index.js'

/**
 * Bid History List Component.
 * Displays a list of recent bids or a "no bids" message.
 *
 * @param props - Component props.
 */
const BidHistoryList: React.FC<{ bids: BidType[] }> = ({ bids }) => {
	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Lịch sử đấu giá</h3>
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				{bids.length > 0 ? (
					<div className="divide-y">
						{bids.map((bid, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-4"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
										<User className="h-4 w-4" />
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-medium">
											{bid.bidder.firstName}{' '}
											{bid.bidder.lastName}
										</span>
										<span className="text-xs text-muted-foreground flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{/* Note: Ensure bid has a timestamp/createdAt field in your shared types, typically 'createdAt' or derived from context */}
											Vừa xong
										</span>
									</div>
								</div>
								<div className="text-right font-semibold text-primary">
									{bid.price.toLocaleString('vi-VN')} ₫
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="p-8 text-center text-muted-foreground">
						Chưa có lượt đấu giá nào. Hãy là người đầu tiên!
					</div>
				)}
			</div>
		</div>
	)
}

export default BidHistoryList
