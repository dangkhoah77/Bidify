import { useEffect, useState } from 'react'

const GRECAPTCHA_READY_DELAY = 500
const GRECAPTCHA_MAX_WAIT = 10000

export const useRecaptcha = (siteKey: string) => {
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		if (!siteKey) return

		let timeoutId: NodeJS.Timeout
		let attempts = 0
		const maxAttempts = GRECAPTCHA_MAX_WAIT / GRECAPTCHA_READY_DELAY

		const checkReady = () => {
			attempts++

			if (window.grecaptcha?.ready) {
				window.grecaptcha.ready(() => setIsReady(true))
				return
			}

			if (attempts < maxAttempts) {
				timeoutId = setTimeout(checkReady, GRECAPTCHA_READY_DELAY)
			}
		}

		checkReady()

		return () => {
			if (timeoutId) clearTimeout(timeoutId)
		}
	}, [siteKey])

	const executeRecaptcha = async (action: string): Promise<string> => {
		if (!isReady) {
			throw new Error('reCAPTCHA is not ready yet')
		}

		if (!window.grecaptcha) {
			throw new Error('reCAPTCHA not loaded')
		}

		try {
			return await window.grecaptcha.execute(siteKey, { action })
		} catch (error: any) {
			throw new Error(`reCAPTCHA execution failed: ${error.message}`)
		}
	}

	return { isReady, executeRecaptcha }
}

declare global {
	interface Window {
		grecaptcha: any
	}
}
