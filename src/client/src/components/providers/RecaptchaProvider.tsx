import { useEffect, useRef } from 'react'

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || ''

let scriptLoaded = false

export const RecaptchaProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const hasLoaded = useRef(false)

	useEffect(() => {
		// ✅ Only load once per app lifetime
		if (hasLoaded.current || scriptLoaded) {
			return
		}

		if (!RECAPTCHA_SITE_KEY) {
			console.error('❌ RECAPTCHA_SITE_KEY missing')
			return
		}

		hasLoaded.current = true
		scriptLoaded = true

		// Check for existing script
		const scriptSrc = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
		const existingScript = document.querySelector(
			`script[src="${scriptSrc}"]`
		)

		if (existingScript) {
			console.log('✅ reCAPTCHA script already loaded')
			return
		}

		// Load script
		console.log('📥 Loading reCAPTCHA script...')
		const script = document.createElement('script')
		script.src = scriptSrc
		script.async = true
		script.defer = true
		script.id = 'recaptcha-v3-global'

		script.onload = () => {
			console.log('✅ reCAPTCHA script loaded')
		}

		script.onerror = () => {
			console.error('❌ Failed to load reCAPTCHA')
			scriptLoaded = false
			hasLoaded.current = false
		}

		document.head.appendChild(script)
	}, [])

	// Monitor badge
	useEffect(() => {
		const interval = setInterval(() => {
			const badge = document.querySelector(
				'.grecaptcha-badge'
			) as HTMLElement
			if (badge) {
				badge.style.visibility = 'visible'
				badge.style.display = 'block'
				badge.style.opacity = '1'
			}
		}, 2000)

		return () => clearInterval(interval)
	}, [])

	return <>{children}</>
}

declare global {
	interface Window {
		grecaptcha: any
	}
}
