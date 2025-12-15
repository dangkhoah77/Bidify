import { PageState } from 'Client/Data/Types/index.js'

/**
 * Type definition for the Socket context value.
 *
 * @type PageContextValueType
 * @property {PageState} pageState - The current state of the page
 * @property {(loading: boolean) => void} setPageLoading - Function to set the loading state
 * @property {(message: string, type: 'success' | 'error' | 'info', removeDelay?: number) => string} addNotification - Function to add a notification
 * @property {(id: string) => void} removeNotification - Function to remove a notification by ID
 */
export type PageContextValueType = {
	pageState: PageState

	setPageLoading: (loading: boolean) => void
	addNotification: (
		message: string,
		type: 'success' | 'error' | 'info',
		removeDelay?: number
	) => string
	removeNotification: (id: string) => void
}
