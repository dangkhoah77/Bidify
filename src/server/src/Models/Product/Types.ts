import { Product } from 'Shared/Data/Types/index.js'
import { DocumentType, ModelType } from 'Server/Data/Types.js'

import { ServerUser, UserDocument } from 'Server/Models/User/index.js'
import {
	ServerCategory,
	CategoryDocument,
} from 'Server/Models/Category/index.js'

/**
 * Product type representing an item listed for auction or sale.
 *
 * @type ServerProduct
 * @property {string} id - The unique identifier of the product.
 * @property {string} name - Name of the product
 * @property {string} description - Description of the product
 * @property {ServerCategory} category - The category of the product
 * @property {ServerUser} seller - The user who is selling the product
 * @property {Image[]} images - Array of images for the product
 * @property {number} startPrice - Starting price of the product
 * @property {number} priceStep - Minimum increment for bids
 * @property {number} currentPrice - Current highest bid price
 * @property {number} buyNowPrice - "Buy Now" price of the product
 * @property {ServerUser} [highestBidder] - The user who has the highest bid, if any
 * @property {Date} startTime - Auction start time
 * @property {Date} endTime - Auction end time
 * @property {boolean} autoExtend - Indicates if the auction end time should be auto-extended
 * @property {boolean} allowUnreviewedBidders - Indicates whether users without review history are allowed to bid
 * @property {boolean} active - Indicates if the product is active for bidding
 * @property {ServerUser} [winner] - The user who won the auction, if any
 * @property {TRANSACTION_STEP} [transactionStatus] - Current transaction status of the product, if applicable
 */
export type ServerProduct = Omit<
	Product,
	'category' | 'seller' | 'highestBidder' | 'winner'
> & {
	category: ServerCategory
	seller: ServerUser
	highestBidder?: ServerUser
	winner?: ServerUser
}

/**
 * Interface representing a raw Product document type.
 *
 * @interface IProduct
 * @property {string} name - Name of the product
 * @property {string} description - Description of the product
 * @property {CategoryDocument | string} category - Reference to the Category of the product
 * @property {UserDocument | string} seller - Reference to the User who is selling the product
 * @property {Image[]} images - Array of images for the product
 * @property {number} startPrice - Starting price of the product
 * @property {number} priceStep - Minimum increment for bids
 * @property {number} currentPrice - Current highest bid price
 * @property {number} buyNowPrice - "Buy Now" price of the product
 * @property {UserDocument | string} [highestBidder] - Reference to the User who has the highest bid, if any
 * @property {Date} startTime - Auction start time
 * @property {Date} endTime - Auction end time
 * @property {boolean} autoExtend - Indicates if the auction end time should be auto-extended
 * @property {boolean} allowUnreviewedBidders - Indicates whether users without review history are allowed to bid
 * @property {boolean} active - Indicates if the product is active for bidding
 * @property {UserDocument | string} [winner] - Reference to the User who won the auction, if any
 * @property {TRANSACTION_STEP} [transactionStatus] - Current transaction status of the product, if applicable
 */
export interface IProduct
	extends Omit<
		ServerProduct,
		'category' | 'seller' | 'highestBidder' | 'winner'
	> {
	category: CategoryDocument | string
	seller: UserDocument | string
	highestBidder?: UserDocument | string
	winner?: UserDocument | string
}

/**
 * Mongoose document interface for Product.
 *
 * @interface ProductDocument
 * @property {ObjectId} _id - The MongoDB ObjectId.
 * @property {number} __v - The version key.
 * @property {string} name - Name of the product
 * @property {string} description - Description of the product
 * @property {CategoryDocument | string} category - Reference to the Category of the product
 * @property {UserDocument | string} seller - Reference to the User who is selling the product
 * @property {Image[]} images - Array of images for the product
 * @property {number} startPrice - Starting price of the product
 * @property {number} priceStep - Minimum increment for bids
 * @property {number} currentPrice - Current highest bid price
 * @property {number} buyNowPrice - "Buy Now" price of the product
 * @property {UserDocument | string} [highestBidder] - Reference to the User who has the highest bid, if any
 * @property {Date} startTime - Auction start time
 * @property {Date} endTime - Auction end time
 * @property {boolean} autoExtend - Indicates if the auction end time should be auto-extended
 * @property {boolean} allowUnreviewedBidders - Indicates whether users without review history are allowed to bid
 * @property {boolean} active - Indicates if the product is active for bidding
 * @property {UserDocument | string} [winner] - Reference to the User who won the auction, if any
 * @property {TRANSACTION_STEP} [transactionStatus] - Current transaction status of the product, if applicable
 */
export interface ProductDocument extends DocumentType<IProduct> {}

/**
 * Mongoose Model interface for Product.
 *
 * @interface ProductModel
 * @property {function} populateDocument - Populates the referenced fields in a Product document.
 * @property {function} toObject - Converts a Product document to its ServerProduct representation.
 * @property {function} toDto - Converts a Product document to its Product DTO representation.
 */
export interface ProductModel
	extends ModelType<Product, ServerProduct, IProduct, ProductDocument> {}
