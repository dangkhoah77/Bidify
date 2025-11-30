import { useEffect, useRef } from 'react'

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || ''
const SCRIPT_SRC = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
const BADGE_CHECK_INTERVAL = 2000
const BADGE_MAX_ATTEMPTS = 15
const BADGE_RETRY_DELAY = 300
const GRECAPTCHA_READY_DELAY = 500

let isInitialized = false

export const RecaptchaProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const hasInitialized = useRef(false)

	useEffect(() => {
		if (hasInitialized.current || isInitialized || !RECAPTCHA_SITE_KEY) {
			return
		}

		hasInitialized.current = true
		isInitialized = true

		const ensureBadgeVisible = (badge: HTMLElement) => {
			badge.style.visibility = 'visible'
			badge.style.opacity = '1'
			badge.style.display = 'block'
		}

		const checkBadge = () => {
			let attempts = 0

			const check = () => {
				attempts++
				const badge = document.querySelector(
					'.grecaptcha-badge'
				) as HTMLElement

				if (badge) {
					ensureBadgeVisible(badge)
					return
				}

				if (attempts < BADGE_MAX_ATTEMPTS) {
					setTimeout(check, BADGE_RETRY_DELAY)
				}
			}

			check()
		}

		const executeRecaptcha = () => {
			window.grecaptcha
				.execute(RECAPTCHA_SITE_KEY, { action: 'page_load' })
				.then(checkBadge)
				.catch(() => {}) // Silent fail in production
		}

		const initRecaptcha = () => {
			if (!window.grecaptcha?.ready) {
				setTimeout(initRecaptcha, GRECAPTCHA_READY_DELAY)
				return
			}

			window.grecaptcha.ready(executeRecaptcha)
		}

		const existingScript = document.querySelector(
			`script[src="${SCRIPT_SRC}"]`
		)

		if (existingScript) {
			initRecaptcha()
		} else {
			// Cleanup old scripts
			document
				.querySelectorAll('script[src*="recaptcha/api.js"]')
				.forEach((script) => script.remove())

			delete (window as any).grecaptcha

			// Load new script
			const script = document.createElement('script')
			script.src = SCRIPT_SRC
			script.async = true
			script.defer = true
			script.id = 'recaptcha-v3-global'
			script.onload = initRecaptcha

			document.head.appendChild(script)
		}
	}, [])

	useEffect(() => {
		const monitorInterval = setInterval(() => {
			const badge = document.querySelector(
				'.grecaptcha-badge'
			) as HTMLElement

			if (badge) {
				const { visibility, display } = window.getComputedStyle(badge)

				if (visibility === 'hidden' || display === 'none') {
					badge.style.visibility = 'visible'
					badge.style.display = 'block'
					badge.style.opacity = '1'
				}
			}
		}, BADGE_CHECK_INTERVAL)

		return () => clearInterval(monitorInterval)
	}, [])

	return <>{children}</>
}

declare global {
	interface Window {
		grecaptcha: any
	}
}
