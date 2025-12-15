import React, { createElement, useState, useEffect, useCallback } from 'react'
import { ReactNode } from 'react'
import chalk from 'chalk'

import {
	ServerUser,
	LoginRequestData,
	SignupRequestData,
} from 'Shared/Data/Types/index.js'
import AuthController from 'Client/Controllers/AuthController.js'
import AuthContext from './context.js'

/**
 * Provider for the Authentication context.
 *
 * @param props - Props containing child components to wrap.
 * @return The Authentication context provider component.
 */
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<ServerUser | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	/**
	 * Helper to handle successful authentication response.
	 * Saves the token to localStorage and updates state.
	 *
	 * @param {string} token - The JWT token received from the server.
	 * @param {ServerUser} userData - The user profile data.
	 */
	const handleAuthSuccess = (token: string, userData: ServerUser) => {
		localStorage.setItem('token', token)
		setUser(userData)
		setIsAuthenticated(true)
	}

	/**
	 * Fetch the current authenticated user from the server.
	 */
	const fetchUser = useCallback(async () => {
		const token = localStorage.getItem('token')

		// No token, user is not authenticated
		if (!token) {
			setIsLoading(false)
			return
		}

		// Token exists, verify it with the server
		try {
			const responseData = (await AuthController.me()).data

			if (responseData.success && responseData.data) {
				setUser(responseData.data.user)
				setIsAuthenticated(true)
			} else {
				throw new Error('Failed to fetch user data')
			}
		} catch (error) {
			console.error(`${chalk.red('Error fetching user data:')} ${error}`)
			logout()
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchUser()
	}, [fetchUser])

	/**
	 * Handles user login.
	 * Calls the AuthController and updates state on success.
	 *
	 * @param {LoginRequestData} data - Login credentials.
	 */
	const login = async (data: LoginRequestData) => {
		const resData = (await AuthController.login(data)).data

		if (resData.success && resData.data) {
			handleAuthSuccess(resData.data.token, resData.data.user)
		} else {
			throw new Error(resData.error)
		}
	}

	/**
	 * Handles user registration.
	 * Calls the AuthController and updates state on success (auto-login).
	 *
	 * @param {SignupRequestData} data - Registration data.
	 */
	const register = async (data: SignupRequestData) => {
		const resData = (await AuthController.register(data)).data

		if (resData.success && resData.data) {
			handleAuthSuccess(resData.data.token, resData.data.user)
		} else {
			throw new Error(resData.error)
		}
	}

	/**
	 * Logs out the current user.
	 * Clears the authentication token and resets user state.
	 */
	const logout = () => {
		localStorage.removeItem('token')
		setUser(null)
		setIsAuthenticated(false)
	}

	return createElement(
		AuthContext.Provider,
		{
			value: {
				user,
				isAuthenticated,
				isLoading,
				login,
				register,
				logout,
				refetchUser: fetchUser,
			},
		},
		children
	)
}

export default AuthProvider
