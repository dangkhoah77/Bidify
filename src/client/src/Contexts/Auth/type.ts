import {
	ServerUser,
	LoginRequestData,
	SignupRequestData,
} from 'Shared/Data/Types/index.js'

/**
 * Interface defining the Authentication Context State and Actions.
 *
 * @type AuthContextValueType
 * @property {ServerUser | null} user - The currently authenticated user or null if not authenticated.
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {boolean} isLoading - Indicates if the authentication status is being determined.
 * @property {(data: LoginRequestData) => Promise<void>} login - Function to handle user login.
 * @property {(data: SignupRequestData) => Promise<void>} register - Function to handle user registration.
 * @property {() => void} logout - Function to log the user out and clear session.
 * @property {() => Promise<void>} refetchUser - Function to re-fetch the current authenticated user from the server.
 */
export type AuthContextValueType = {
	user: ServerUser | null
	isAuthenticated: boolean
	isLoading: boolean

	login: (data: LoginRequestData) => Promise<void>
	register: (data: SignupRequestData) => Promise<void>
	logout: () => void
	refetchUser: () => Promise<void>
}
