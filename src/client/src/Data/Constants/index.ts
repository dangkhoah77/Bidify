/**
 * The API_URL for making HTTP requests to the backend server.
 */
export const API_URL = process.env.API_URL as string

/**
 * The SOCKET_URL for establishing WebSocket connections to the backend server.
 */
export const SOCKET_URL =
	window.location.host.indexOf('localhost') >= 0
		? 'http://127.0.0.1:3000'
		: window.location.host

/**
 * Enumeration of action types for page context management.
 *
 * @enum {string} PageAction
 * @property {string} SetLoading - Action to set the loading state
 * @property {string} AddNotification - Action to add a notification
 * @property {string} RemoveNotification - Action to remove a notification
 */
export enum PageAction {
	SetLoading = 'SET_LOADING',
	AddNotification = 'ADD_NOTIFICATION',
	RemoveNotification = 'REMOVE_NOTIFICATION',
}
