import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to combine class names with Tailwind CSS merging.
 *
 * @param inputs - Class names to combine.
 * @return The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
