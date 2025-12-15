import React from 'react'

import { PageState } from 'Client/Data/Types/index.js'
import { PageContextValueType } from './index.js'

/**
 * Default values for the PageContext.
 */
export const DEFAULT: PageContextValueType = {
	pageState: {
		loading: false,
		notifications: [],
	} as PageState,
	setPageLoading: () => {},
	addNotification: () => '',
	removeNotification: () => {},
}

/**
 * Context for managing page state.
 */
const PageContext = React.createContext(DEFAULT)

export default PageContext
