import { BookModel } from "./BookModel"
import { BookRepository } from "./BookRepository"


export const BookController = {
    addBook: async (book: { title: string, author: string }) => {
        const bookModel = new BookModel()
        bookModel.create(book.title, book.author)
        await BookRepository.add(bookModel)
    },
    listBooks: () => {
        return BookRepository.list()
    }
}