import { BookModel } from "../model/BookModel"
import { BookRepository } from "../repository/BookRepository"


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