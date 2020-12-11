import { BookModel } from "./BookModel";
import { DynamoSchema } from "./DynamoSchema";

export const KeyGenarator = {
    book(bookId?: string) {
        if (bookId) {
            return {
                PartitionKey: `BookProfile`,
                SortKey: `Book#${bookId}`,
            }
        } else {
            return {
                PartitionKey: `BookProfile`,
            }
        }
    }
}

export const ModelScrap = {
    book(book: BookModel): DynamoSchema {
        return {
            ...KeyGenarator.book(book.id),
            BookId: book.id,
            BookAuthor: book.author,
            BookTitle: book.title
        }
    }
}