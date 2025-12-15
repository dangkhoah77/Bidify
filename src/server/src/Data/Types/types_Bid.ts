/**
 * Type representing a bid placed on a product.
 *
 * @type Bid
 * @property {Product} product - The product on which the bid is placed.
 * @property {User} bidder - The user who placed the bid.
 * @property {number} price - The amount of the bid.
 * @property {number} maxPrice - The maximum auto-bid amount set by the bidder, if any.
 */
export type Bid = {
	product: Product
	bidder: User
	price: number
	maxPrice: number
}
