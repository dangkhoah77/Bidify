import { Socket } from 'socket.io-client'

/**
 * Interface defining the Socket Context State and Actions.
 *
 * @type SocketContextValueType
 * @property {Socket | null} socket - The active Socket.io instance.
 * @property {boolean} connected - True if the socket is currently connected to the server.
 * @property {() => void} connect - Function to manually initiate connection (usually handled automatically).
 * @property {() => void} disconnect - Function to manually close the connection.
 */
export type SocketContextValueType = {
	socket: Socket | null
	connected: boolean

	connect: () => void
	disconnect: () => void
}
