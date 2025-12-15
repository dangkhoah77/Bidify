import React, { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

/**
 * Countdown Timer Component.
 * Calculates and displays the remaining time until a specified date.
 *
 * @param props - Component props containing the auction end time.
 */
const CountdownTimer: React.FC<{
	endTime: string | Date
}> = ({ endTime }) => {
	/**
	 * Calculates the time difference between now and the end time.
	 *
	 * @returns Time parts (days, hours, minutes, seconds) and expired flag.
	 */
	const calculateTimeLeft = () => {
		const end = new Date(endTime).getTime()
		const now = Date.now()
		const difference = end - now

		if (difference <= 0) {
			return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
		}

		return {
			days: Math.floor(difference / (1000 * 60 * 60 * 24)),
			hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((difference / 1000 / 60) % 60),
			seconds: Math.floor((difference / 1000) % 60),
			expired: false,
		}
	}

	// Calculate initial time left and determine urgency
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
	const isUrgent = timeLeft.days == 0 && timeLeft.hours < 1

	// Render expired state
	if (timeLeft.expired) {
		return (
			<div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-4">
				<Clock className="h-5 w-5 text-destructive" />
				<span className="font-semibold text-destructive">
					Đấu giá đã kết thúc
				</span>
			</div>
		)
	}

	// Update the timer every second
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft())
		}, 1000)

		// Cleanup interval on unmount
		return () => clearInterval(timer)
	}, [endTime])

	return (
		<div
			className={`flex items-center gap-2 rounded-lg border p-4 ${
				isUrgent
					? 'border-destructive bg-destructive/10 animate-pulse'
					: 'border-primary bg-primary/5'
			}`}
		>
			<Clock
				className={`h-5 w-5 ${isUrgent ? 'text-destructive' : 'text-primary'}`}
			/>
			<div className="flex items-center gap-2 text-sm font-semibold">
				{timeLeft.days > 0 && (
					<div className="flex flex-col items-center">
						<span className="text-2xl font-bold">
							{timeLeft.days}
						</span>
						<span className="text-xs text-muted-foreground">
							ngày
						</span>
					</div>
				)}
				<div className="flex flex-col items-center">
					<span className="text-2xl font-bold">
						{String(timeLeft.hours).padStart(2, '0')}
					</span>
					<span className="text-xs text-muted-foreground">giờ</span>
				</div>
				<span className="text-2xl">:</span>
				<div className="flex flex-col items-center">
					<span className="text-2xl font-bold">
						{String(timeLeft.minutes).padStart(2, '0')}
					</span>
					<span className="text-xs text-muted-foreground">phút</span>
				</div>
				<span className="text-2xl">:</span>
				<div className="flex flex-col items-center">
					<span className="text-2xl font-bold">
						{String(timeLeft.seconds).padStart(2, '0')}
					</span>
					<span className="text-xs text-muted-foreground">giây</span>
				</div>
			</div>
		</div>
	)
}

export default CountdownTimer
