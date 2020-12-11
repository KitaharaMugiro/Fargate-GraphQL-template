export type Book = {
    title: string
    author: string
}

const books = [
    {
        title: 'タイトル',
        author: '著者',
    },
];

export const BookController = {
    addBook: (book: Book) => {
        books.push(book)
    },
    listBooks: () => {
        return books
    }
}