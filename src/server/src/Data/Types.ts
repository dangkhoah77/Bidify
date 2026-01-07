import mongoose, { Document, Model } from 'mongoose'

/**
 * Generic type to represent a Mongoose document type.
 *
 * @type DocumentType
 * @template T - The raw document type.
 */
export type DocumentType<T> = T &
	Omit<Document<mongoose.Types.ObjectId, {}, T>, 'id'>

/**
 * Generic type to represent a Mongoose Model with additional static methods.
 *
 * @type ModelType
 * @template T - The DTO type.
 * @template U - The server object type.
 * @template V - The raw document type.
 * @template K - The Mongoose document interface type.
 * @property {(doc: DocumentType<V>): Promise<DocumentType<V>>} populateDocument - Static method to fully populate referenced fields in a document.
 * @property {(doc: DocumentType<V>): Promise<U>} toObject - Static method to transform a document to a server object.
 * @property {(doc: DocumentType<V>): Promise<T>} toDto - Static method to transform a document to a DTO.
 */
export type ModelType<T, U, V, K> = Model<V, {}, {}, {}, K> & {
	populateDocument(doc: DocumentType<V>): Promise<DocumentType<V>>
	toObject(doc: DocumentType<V>): Promise<U>
	toDto(doc: DocumentType<V>): Promise<T>
}
