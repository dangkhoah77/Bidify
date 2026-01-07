import { Bid } from 'Shared/Data/Types/index.js'
import { DocumentType, ModelType } from 'Server/Data/Types.js'

import { ServerUser, UserDocument } from 'Server/Models/User/index.js'
import { ServerProduct, ProductDocument } from 'Server/Models/Product/index.js'

/**
 * Server-side Bid interface representing a bid placed by a user on a product.
 *
 * @interface ServerBid
 * @property {string} id - The unique identifier of the bid.
 * @property {ServerProduct} product - The product on which the bid is placed.
 * @property {ServerUser} bidder - The user who placed the bid.
 * @property {number} price - The amount of the bid.
 * @property {number} maxPrice - The maximum auto-bid amount set by the bidder, if any.
 * @property {boolean} latest - Indicates if the bid is the latest bid by the user on the product.
 * @property {BID_STATE} state - The current state of the bid.
 * @property {Date} createdAt - The date and time when the bid was placed.
 */
export interface ServerBid extends Omit<Bid, 'product' | 'bidder'> {
	product: ServerProduct
	bidder: ServerUser
}

/**
 * Interface representing a raw Bid document type.
 *
 * @interface IBid
 * @property {string} id - The unique identifier of the bid.
 * @property {ProductDocument | string} product - The product on which the bid is placed.
 * @property {UserDocument | string} bidder - The user who placed the bid.
 * @property {number} price - The amount of the bid.
 * @property {number} maxPrice - The maximum auto-bid amount set by the bidder, if any.
 * @property {boolean} latest - Indicates if the bid is the latest bid by the user on the product.
 * @property {BID_STATE} state - The current state of the bid.
 * @property {Date} createdAt - The date and time when the bid was placed.
 */
export interface IBid extends Omit<ServerBid, 'product' | 'bidder'> {
	product: ProductDocument | string
	bidder: UserDocument | string
}

/**
 * Mongoose document interface for Bid.
 *
 * @interface BidDocument
 * @property {ObjectId} _id - The MongoDB ObjectId.
 * @property {number} __v - The version key.
 * @property {string} id - The unique identifier of the bid.
 * @property {ProductDocument | string} product - The product on which the bid is placed.
 * @property {UserDocument | string} bidder - The user who placed the bid.
 * @property {number} price - The amount of the bid.
 * @property {number} maxPrice - The maximum auto-bid amount set by the bidder, if any.
 * @property {boolean} latest - Indicates if the bid is the latest bid by the user on the product.
 * @property {BID_STATE} state - The current state of the bid.
 * @property {Date} createdAt - The date and time when the bid was placed.
 */
export interface BidDocument extends DocumentType<IBid> {}

/**
 * Mongoose Model interface for Bid.
 *
 * @property {(doc: BidDocument): Promise<BidDocument>} populateDocument - Static method to fully populate referenced fields in a Bid document.
 * @property {(doc: BidDocument): Promise<ServerBid>} toObject - Static method to transform a Bid document to a ServerBid object.
 * @property {(doc: BidDocument): Promise<Bid>} toDto - Static method to transform a Bid document to a Bid DTO.
 */
export interface BidModel
	extends ModelType<Bid, ServerBid, IBid, BidDocument> {}
