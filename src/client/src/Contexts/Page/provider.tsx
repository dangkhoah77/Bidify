import React, { useReducer } from 'react'
import chalk from 'chalk'

import { PageState, PageReducerAction } from 'Client/Data/Types/index.js'
import { PageAction } from 'Client/Data/Constants/index.js'
import PageContext, { DEFAULT } from './context.js'

/**
 * Reducer function to manage page state updates.
 *
 * @param state - The current state of the page.
 * @param action - The action to be performed on the state.
 * @return The updated page state.
 */
const PageReducer = (
	state: PageState,
	action: PageReducerAction
): PageState => {
	switch (action.type) {
		case PageAction.SetLoading:
			if (typeof action.payload != 'boolean') {
				console.error(
					chalk.red(
						`[PageReducer] SET_LOADING action payload must be a boolean.`
					)
				)
				return state
			}
			return { ...state, loading: action.payload }
		case PageAction.AddNotification:
			return {
				...state,
				notifications: [
					...state.notifications,
					{
						...action.payload,
						id: Math.random().toString(36).substring(7),
					},
				],
			}
		case PageAction.RemoveNotification:
			return {
				...state,
				notifications: state.notifications.filter(
					(n) => n.id !== action.payload
				),
			}
		default:
			return state
	}
}

/**
 * Provider for the PageContext.
 *
 * @param children - The child components that will have access to the PageContext.
 * @return The PageContext provider component.
 */
const PageProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [pageState, dispatch] = useReducer(PageReducer, DEFAULT.pageState)

	/**
	 * Sets the loading state of the page.
	 *
	 * @param loading - A boolean indicating whether the page is loading.
	 */
	const setPageLoading = (loading: boolean) => {
		dispatch({ type: PageAction.SetLoading, payload: loading })
	}

	/**
	 * Adds a notification to the page state.
	 *
	 * @param message - The notification message.
	 * @param type - The type of notification ('success', 'error', 'info').
	 * @param removeDelay - Optional delay in milliseconds to auto-remove the notification.
	 * @return The ID of the added notification.
	 */
	const addNotification = (
		message: string,
		type: 'success' | 'error' | 'info',
		removeDelay?: number
	): string => {
		const id = Math.random().toString(36).substring(7)

		// Dispatch add notification action
		dispatch({
			type: PageAction.AddNotification,
			payload: { id, message, type },
		})

		// Auto-remove notification after delay
		setTimeout(() => {
			dispatch({ type: PageAction.RemoveNotification, payload: id })
		}, removeDelay || 5000)

		return id
	}

	/**
	 * Removes a notification from the page state by ID.
	 *
	 * @param id - The ID of the notification to be removed.
	 */
	const removeNotification = (id: string) => {
		dispatch({ type: PageAction.RemoveNotification, payload: id })
	}

	return (
		<PageContext.Provider
			value={{
				pageState,
				setPageLoading,
				addNotification,
				removeNotification,
			}}
		>
			{children}

			{/* Global Loader Overlay */}
			{pageState.loading && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
				</div>
			)}

			{/* Global Notifications Container */}
			<div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
				{pageState.notifications.map((note) => (
					<div
						key={note.id}
						className={`min-w-[300px] rounded-lg p-4 shadow-lg text-white animate-in slide-in-from-right-full ${
							note.type === 'error'
								? 'bg-destructive'
								: note.type === 'success'
									? 'bg-green-600'
									: 'bg-blue-600'
						}`}
						onClick={() =>
							dispatch({
								type: PageAction.RemoveNotification,
								payload: note.id,
							})
						}
					>
						{note.message}
					</div>
				))}
			</div>
		</PageContext.Provider>
	)
}

export default PageProvider
