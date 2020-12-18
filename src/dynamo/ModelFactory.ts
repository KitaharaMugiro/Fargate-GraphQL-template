import { BookModel } from "../model/BookModel"
import { DynamoSchema } from "./DynamoSchema"

export const ModelFactory = {
    bookModel(dynamoSchema: DynamoSchema) {
        const book = new BookModel()
        book.id = dynamoSchema.BookId
        book.title = dynamoSchema.BookTitle
        book.author = dynamoSchema.BookAuthor
        return book
    }
}