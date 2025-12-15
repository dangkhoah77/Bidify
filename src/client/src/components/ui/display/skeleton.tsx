import { cn } from 'Client/Utility/index.js'

/**
 * Skeleton Component.
 * Used as a placeholder while content is loading.
 */
function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-muted', className)}
			{...props}
		/>
	)
}

export { Skeleton }
