import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/Common/Header.js'
import Footer from '../Components/Common/Footer.js'

/**
 * Main Layout Component.
 * Wraps the application with header, footer, and main content area.
 */
const MainLayout: React.FC = () => {
	return (
		<div className="flex min-h-screen flex-col bg-background font-sans antialiased">
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}

export default MainLayout
